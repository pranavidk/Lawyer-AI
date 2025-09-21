import ollama
import os
import json
import sys
import glob
from pypdf import PdfReader
import re
from pathlib import Path

# Storage for multiple documents
documents = {}  # {filename: [chunks]}
document_metadata = {}  # {filename: {title, type, size}}
db_file = "rag_database.json"  # Persistent storage file

# --- Step 1: Load PDF ---
def load_pdf_text(path):
    if not os.path.exists(path):
        return ""
    
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF {path}: {e}")
        return ""

# --- Step 2: Load text file ---
def load_text_file(path):
    if not os.path.exists(path):
        return ""
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading text file {path}: {e}")
        return ""

# --- Step 3: Load document based on type ---
def load_document(path):
    file_ext = Path(path).suffix.lower()
    
    if file_ext == '.pdf':
        return load_pdf_text(path)
    elif file_ext in ['.txt', '.md', '.doc', '.docx']:
        return load_text_file(path)
    else:
        print(f"Unsupported file type: {file_ext}")
        return ""

# --- Step 4: Split into chunks ---
def chunk_text(text, chunk_size=500):
    # Clean the text first
    text = re.sub(r'\s+', ' ', text)
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# --- Step 5: Enhanced search function ---
def search_chunks(query, top_k=5):
    query_words = set(query.lower().split())
    scored_chunks = []
    
    # Search across all documents
    for filename, chunks in documents.items():
        for i, chunk in enumerate(chunks):
            chunk_lower = chunk.lower()
            chunk_words = set(chunk_lower.split())
            
            # Calculate scoring
            word_matches = len(query_words.intersection(chunk_words))
            phrase_score = 10 if query.lower() in chunk_lower else 0
            
            # Word order bonus
            order_bonus = 0
            query_list = query.lower().split()
            chunk_list = chunk_lower.split()
            for j in range(len(chunk_list) - len(query_list) + 1):
                if chunk_list[j:j+len(query_list)] == query_list:
                    order_bonus = 5
                    break
            
            total_score = word_matches + phrase_score + order_bonus
            
            if total_score > 0:
                scored_chunks.append((total_score, filename, i, chunk))
    
    # Sort by score and return top_k
    scored_chunks.sort(reverse=True)
    return scored_chunks[:top_k]

# --- Step 6: Database persistence functions ---
def save_database():
    """Save the current database to JSON file"""
    try:
        data = {
            'documents': documents,
            'metadata': document_metadata
        }
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Database saved to {db_file}")
    except Exception as e:
        print(f"Error saving database: {e}")

def load_database():
    """Load the database from JSON file"""
    global documents, document_metadata
    if not os.path.exists(db_file):
        return False
    
    try:
        with open(db_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        documents = data.get('documents', {})
        document_metadata = data.get('metadata', {})
        print(f"📂 Loaded existing database with {len(documents)} documents")
        return True
    except Exception as e:
        print(f"Error loading database: {e}")
        return False

def check_document_changes(file_paths):
    """Check if any documents have been modified since last load"""
    if not os.path.exists(db_file):
        return file_paths  # All files need to be processed
    
    try:
        with open(db_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        existing_metadata = data.get('metadata', {})
        
        changed_files = []
        for file_path in file_paths:
            if file_path not in existing_metadata:
                changed_files.append(file_path)
            else:
                # Check if file modification time has changed
                current_size = os.path.getsize(file_path)
                stored_size = existing_metadata[file_path].get('size', 0)
                if current_size != stored_size:
                    changed_files.append(file_path)
        
        return changed_files
    except:
        return file_paths  # If error, process all files

# --- Step 7: Load and index documents ---
def load_documents(file_paths):
    global documents, document_metadata
    
    if not file_paths:
        print("No files provided.")
        return False
    
    # First, try to load existing database
    load_database()
    
    # Check which files need to be processed (new or changed)
    files_to_process = check_document_changes(file_paths)
    
    if not files_to_process:
        print("✅ All documents are up to date in database")
        return len(documents) > 0
    
    print(f"🔄 Processing {len(files_to_process)} new or changed documents...")
    
    loaded_count = 0
    total_chunks = 0
    
    for file_path in files_to_process:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
        
        print(f"Loading: {file_path}")
        text = load_document(file_path)
        
        if not text.strip():
            print(f"  ⚠️  No content extracted from {file_path}")
            continue
        
        chunks = chunk_text(text)
        documents[file_path] = chunks
        total_chunks += len(chunks)
        loaded_count += 1
        
        # Store metadata
        file_size = os.path.getsize(file_path)
        document_metadata[file_path] = {
            'title': Path(file_path).name,
            'type': Path(file_path).suffix.lower(),
            'size': file_size,
            'chunks': len(chunks)
        }
        
        print(f"  ✅ Loaded {len(chunks)} chunks")
    
    # Save the updated database
    if loaded_count > 0:
        save_database()
    
    total_docs = len(documents)
    total_chunks = sum(len(chunks) for chunks in documents.values())
    print(f"\n📚 Database now contains {total_docs} documents with {total_chunks} total chunks")
    return total_docs > 0

# --- Step 7: Query function ---
def rag_query(question, top_k=5, use_ai=True):
    if not documents:
        return "No documents loaded."
    
    # Search for relevant chunks
    relevant_chunks = search_chunks(question, top_k)
    
    if not relevant_chunks:
        return "No relevant information found in the documents."
    
    # Format context with source information
    context_parts = []
    for score, filename, chunk_idx, chunk in relevant_chunks:
        doc_name = Path(filename).name
        context_parts.append(f"[Source: {doc_name}]\n{chunk}")
    
    context = "\n\n".join(context_parts)
    
    # For simple queries, provide direct results without AI processing
    if not use_ai or any(phrase in question.lower() for phrase in ["list documents", "what documents", "show documents", "database"]):
        return f"Found relevant information:\n\n{context}"
    
    prompt = f"""You are a legal research assistant. Answer the question based on the following context from multiple legal documents. Be specific and cite which document the information comes from.

Context from documents:
{context}

Question: {question}

Answer based on the documents:"""

    try:
        print("🤔 Processing query with AI... (this may take a moment)")
        response = ollama.chat(
            model="llama2-uncensored:7b",
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 500  # Limit response length for faster processing
            }
        )
        return response["message"]["content"]
    except Exception as e:
        return f"Error processing query: {e}"

# --- Step 8: List loaded documents ---
def list_documents():
    if not documents:
        print("No documents loaded.")
        return
    
    print("\n📚 Loaded Documents:")
    print("-" * 50)
    for filename, metadata in document_metadata.items():
        print(f"📄 {metadata['title']}")
        print(f"   Type: {metadata['type']}")
        print(f"   Size: {metadata['size']:,} bytes")
        print(f"   Chunks: {metadata['chunks']}")
        print()

# --- Step 9: Main execution ---
def main():
    print("🚀 Multi-Document RAG Assistant")
    print("=" * 40)
    
    # Auto-detect all documents in the current directory
    print("🔍 Auto-detecting documents in current directory...")
    file_paths = []
    supported_patterns = ['*.pdf', '*.txt', '*.md', '*.doc', '*.docx']
    
    for pattern in supported_patterns:
        found_files = glob.glob(pattern)
        file_paths.extend(found_files)
        if found_files:
            print(f"  Found {len(found_files)} {pattern} files")
    
    # Check if specific files were provided via command line
    question = None
    use_ai = True
    
    if len(sys.argv) > 1:
        # Check for --no-ai flag
        if '--no-ai' in sys.argv:
            use_ai = False
            sys.argv.remove('--no-ai')
        
        # Check if the last argument looks like a question (contains spaces or question marks)
        last_arg = sys.argv[-1]
        if ' ' in last_arg or '?' in last_arg:
            # Last argument is a question, everything else are specific files
            specified_files = sys.argv[1:-1]
            question = last_arg
            # Use only the specified files instead of auto-detected ones
            if specified_files:
                file_paths = [f for f in specified_files if os.path.exists(f)]
            # If no specific files provided, keep the auto-detected ones
        else:
            # All arguments are specific file paths
            specified_files = sys.argv[1:]
            question = None
            # Use only the specified files instead of auto-detected ones
            file_paths = [f for f in specified_files if os.path.exists(f)]
    
    # If no files found, show usage
    if not file_paths:
        print("❌ No documents found in current directory.")
        print("Supported formats: PDF, TXT, MD, DOC, DOCX")
        print("Usage:")
        print("  python multi-doc-rag-agent.py  # Auto-detect all documents")
        print("  python multi-doc-rag-agent.py file1.pdf file2.txt  # Use specific files")
        print("  python multi-doc-rag-agent.py 'What is this about?'  # Auto-detect + question")
        return
    
    print(f"📚 Found {len(file_paths)} document(s) to process")
    
    # Load documents
    if not load_documents(file_paths):
        print("❌ Failed to load any documents.")
        return
    
    # Show loaded documents
    list_documents()
    
    # If a question was provided as command line argument, answer it and exit
    if question:
        print(f"Question: {question}")
        answer = rag_query(question, use_ai=use_ai)
        print(f"Answer: {answer}")
        return
    
    # Interactive loop
    print("📖 Multi-Document RAG Assistant Ready! (type 'exit' to quit)")
    print("Commands: 'list' to show documents, 'exit' to quit\n")
    
    while True:
        try:
            question = input("❓ Ask a question: ")
            
            if question.lower() in ["exit", "quit", "q"]:
                print("👋 Goodbye!")
                break
            elif question.lower() == "list":
                list_documents()
                continue
            elif question.strip():
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
