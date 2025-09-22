import ollama
import chromadb
from pypdf import PdfReader
import os

# --- Step 1: Load PDF ---
def load_pdf_text(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text

# --- Step 2: Split into chunks ---
def chunk_text(text, chunk_size=500):
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# --- Step 3: Custom Ollama embedding function ---
class OllamaEmbeddingFunction:
    def __init__(self, model="mxbai-embed-large:latest"):
        self.model = model

    def __call__(self, input: list[str]):
        embeddings = []
        for t in input:
            response = ollama.embeddings(model=self.model, prompt=t)
            embeddings.append(response["embedding"])
        return embeddings


# --- Step 4: Setup Persistent ChromaDB ---
embedding_fn = OllamaEmbeddingFunction()
chroma_client = chromadb.PersistentClient(path="chroma_db")
collection_name = "pdf_chunks"

try:
    collection = chroma_client.get_collection(name=collection_name)
except:
    # Still create the collection with no default embedding function
    collection = chroma_client.create_collection(name=collection_name, embedding_function=None)

# --- Step 5: Index PDF if needed ---
pdf_path = "law-test.pdf"
pdf_text = load_pdf_text(pdf_path)
chunks = chunk_text(pdf_text)

if not collection.count():
    print("Indexing PDF into ChromaDB (this may take a while)...")
    for i, chunk in enumerate(chunks):
        # Explicitly pass the embedding function to the add method
        collection.add(
            documents=[chunk], 
            ids=[f"{os.path.basename(pdf_path)}-{i}"],
            embedding_function=embedding_fn  # 👈 This is the key change
        )
    print("✅ PDF indexed.")
else:
    print("✅ Using existing ChromaDB index.")

# --- Step 6: Query function ---
def rag_query(question, top_k=3):
    results = collection.query(query_texts=[question], n_results=top_k)
    context = "\n".join(results["documents"][0])
    prompt = f"Answer the question based on the following context:\n{context}\n\nQuestion: {question}\nAnswer:"

    response = ollama.chat(
        model="llama2-uncensored:7b",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"]

# --- Step 7: Interactive loop ---
print("\n📖 RAG PDF Assistant Ready! (type 'exit' to quit)\n")
while True:
    question = input("❓ Ask a question: ")
    if question.lower() in ["exit", "quit", "q"]:
        print("👋 Goodbye!")
        break
    answer = rag_query(question)
    print(f"🤖 {answer}\n")
