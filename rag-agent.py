import ollama
import os
import json
import sys
from pypdf import PdfReader
import re

# Simple in-memory storage instead of ChromaDB
pdf_data = []

# --- Step 1: Load PDF ---
def load_pdf_text(path):
    if not os.path.exists(path):
        print(f"PDF file not found: {path}")
        return ""
    
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Could not read PDF: {e}")
        return ""

# --- Step 2: Split into chunks ---
def chunk_text(text, chunk_size=500):
    # Clean the text first
    text = re.sub(r'\s+', ' ', text)  # Replace multiple whitespace with single space
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# --- Step 3: Improved search function ---
def search_chunks(query, chunks, top_k=3):
    query_words = set(query.lower().split())
    scored_chunks = []
    
    for i, chunk in enumerate(chunks):
        chunk_lower = chunk.lower()
        chunk_words = set(chunk_lower.split())
        
        # Calculate multiple scoring factors
        word_matches = len(query_words.intersection(chunk_words))
        
        # Phrase matching (exact phrase gets higher score)
        phrase_score = 0
        query_phrase = query.lower()
        if query_phrase in chunk_lower:
            phrase_score = 10
        
        # Word order bonus (consecutive words get bonus)
        order_bonus = 0
        query_list = query.lower().split()
        chunk_list = chunk_lower.split()
        for j in range(len(chunk_list) - len(query_list) + 1):
            if chunk_list[j:j+len(query_list)] == query_list:
                order_bonus = 5
                break
        
        # Total score
        total_score = word_matches + phrase_score + order_bonus
        
        if total_score > 0:
            scored_chunks.append((total_score, i, chunk))
    
    # Sort by score and return top_k
    scored_chunks.sort(reverse=True)
    return [chunk for score, i, chunk in scored_chunks[:top_k]]

# --- Step 4: Load and index data ---
def load_data(pdf_path):
    global pdf_data
    
    # Check if we already have data
    if pdf_data:
        print("✅ Using existing data.")
        return True
    
    print("Loading PDF document...")
    text = load_pdf_text(pdf_path)
    if not text:
        return False
    
    chunks = chunk_text(text)
    pdf_data = chunks
    print(f"✅ Loaded {len(chunks)} chunks from PDF document.")
    return True

# --- Step 5: Query function ---
def rag_query(question, top_k=5):  # Increased top_k for better context
    if not pdf_data:
        return "No document loaded."
    
    # Search for relevant chunks
    relevant_chunks = search_chunks(question, pdf_data, top_k)
    
    if not relevant_chunks:
        return "No relevant information found in the document."
    
    context = "\n".join(relevant_chunks)
    prompt = f"""You are a legal assistant. Answer the question based ONLY on the following context from the legal document. Be specific and cite relevant details from the document.

Context from document:
{context}

Question: {question}

Answer based on the document:"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )
        return response["message"]["content"]
    except Exception as e:
        return f"Error processing query: {e}"

# --- Main execution ---
def main():
    print("🚀 Legal RAG Assistant (PDF Reader)")

    # Accept PDF path as first argument, default to 'law-test.pdf' if not provided
    if len(sys.argv) > 1 and sys.argv[1].lower().endswith('.pdf'):
        pdf_path = sys.argv[1]
        question_args = sys.argv[2:]
    else:
        pdf_path = "law-test.pdf"
        question_args = sys.argv[1:]

    if not load_data(pdf_path):
        print(f"❌ No PDF found. Please ensure '{pdf_path}' exists in the current directory.")
        return

    # If a question is provided as command line argument (after PDF path), answer it and exit
    if question_args:
        question = " ".join(question_args)
        print(f"Question: {question}")
        answer = rag_query(question)
        print(f"Answer: {answer}")
        return

    # Interactive loop
    print("\n📖 Legal RAG Assistant Ready! (type 'exit' to quit)\n")
    while True:
        try:
            question = input("❓ Ask a legal question: ")
            if question.lower() in ["exit", "quit", "q"]:
                print("👋 Goodbye!")
                break

            if question.strip():
                answer = rag_query(question)
                print(f"🤖 {answer}\n")
            else:
                print("Please enter a valid question.\n")
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except EOFError:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}\n")

if __name__ == "__main__":
    main()
