# Lawyer AI - Indian Legal Assistant Frontend

A modern, responsive React frontend for an AI-powered legal assistant platform designed specifically for Indian legal system. Built with TypeScript, Vite, and Tailwind CSS, featuring a professional design system and smooth animations.

## Features

- **📄 Document Analysis**: Upload and analyze legal documents with AI-powered insights
- **🤖 JuriSense AI Chat**: Interactive legal assistant for real-time legal guidance
- **📚 Legal Knowledge Base**: Comprehensive database of Indian legal concepts and precedents
- **🎨 Modern UI/UX**: Professional design with dark/light theme support
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Performance**: Fast loading with Vite and optimized React components
- **🔒 Security**: Built with security best practices for legal data handling

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router DOM 6
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Font**: Google Inter

## Installation

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lawyer-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=JuriSense AI
VITE_APP_VERSION=1.0.0
```

### Theme Configuration

The app supports light and dark themes. Theme preferences are stored in localStorage and can be toggled via the navbar.

### API Integration

Configure the backend API URL in the environment variables. The frontend expects the following endpoints:

- `POST /api/chat` - Chat with AI assistant
- `POST /api/analyze` - Document analysis
- `GET /api/legal-concepts` - Legal knowledge base

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── HeroSection.tsx # Landing page hero
│   ├── Navbar.tsx      # Navigation component
│   └── ...
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── ChatAssistant.tsx
│   ├── DocumentAnalyzer.tsx
│   └── ...
└── main.tsx           # Application entry point
```

## Backend Integration

This frontend is designed to work with a RESTful API backend. Key integration points:

### Chat Assistant
- Real-time messaging with AI legal assistant
- Message history and context preservation
- Typing indicators and response streaming

### Document Analyzer
- File upload with drag-and-drop support
- Document processing and analysis
- Results visualization and export

### Authentication
- User session management
- Protected routes and permissions
- Profile and settings management

## RAG Agent Integration for Document Analyzer

The Document Analyzer component is designed to integrate with a Retrieval-Augmented Generation (RAG) agent for intelligent document analysis. Here's how to implement the RAG integration:

### 1. Backend RAG Implementation

#### Required Dependencies
```bash
# Python backend dependencies
pip install langchain
pip install langchain-community
pip install langchain-openai
pip install chromadb
pip install pypdf
pip install python-dotenv
```

#### RAG Agent Setup
```python
# rag_agent.py
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os

class LegalRAGAgent:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.vectorstore = None
        self.qa_chain = None
        
    def process_document(self, file_path):
        """Process uploaded legal document"""
        # Load PDF document
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        # Split document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        texts = text_splitter.split_documents(documents)
        
        # Create vector store
        self.vectorstore = Chroma.from_documents(
            texts, 
            self.embeddings,
            persist_directory="./legal_docs_db"
        )
        
        # Create QA chain
        llm = OpenAI(temperature=0.1)
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3})
        )
        
    def analyze_document(self, query):
        """Analyze document with RAG agent"""
        if not self.qa_chain:
            return {"error": "No document processed yet"}
            
        result = self.qa_chain.run(query)
        return {"analysis": result}
```

### 2. API Endpoints

#### Document Upload Endpoint
```python
# FastAPI example
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_agent = LegalRAGAgent()

@app.post("/api/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name
    
    try:
        # Process document with RAG agent
        rag_agent.process_document(tmp_file_path)
        
        # Perform initial analysis
        analysis = rag_agent.analyze_document(
            "Provide a comprehensive analysis of this legal document including key terms, clauses, and potential issues."
        )
        
        return {
            "status": "success",
            "analysis": analysis["analysis"],
            "document_name": file.filename
        }
    finally:
        # Clean up temporary file
        os.unlink(tmp_file_path)

@app.post("/api/query-document")
async def query_document(query: dict):
    """Query the processed document"""
    question = query.get("question", "")
    analysis = rag_agent.analyze_document(question)
    
    return {
        "status": "success",
        "answer": analysis["analysis"]
    }
```

### 3. Frontend Integration

#### Update Document Analyzer Component
```typescript
// src/pages/DocumentAnalyzer.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const DocumentAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing document:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch('/api/query-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      const result = await response.json();
      setAnswer(result.answer);
    } catch (error) {
      console.error('Error querying document:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Document Analyzer</h1>
      
      {/* File Upload */}
      <div className="mb-8">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Analysis Results */}
      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">Analyzing document with RAG agent...</p>
        </div>
      )}

      {analysis && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Document Analysis</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        </div>
      )}

      {/* Query Interface */}
      {analysis && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ask Questions About the Document</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the document..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleQuery}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ask
            </button>
          </div>
          
          {answer && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Answer:</h3>
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentAnalyzer;
```

### 4. Environment Configuration

#### Backend Environment Variables
```env
# .env
OPENAI_API_KEY=your_openai_api_key_here
CHROMA_PERSIST_DIRECTORY=./legal_docs_db
```

#### Frontend Environment Variables
```env
# .env.local
VITE_API_BASE_URL=http://localhost:8000
VITE_RAG_ENABLED=true
```

### 5. Advanced RAG Features

#### Legal Document Preprocessing
```python
# legal_preprocessor.py
import re
from typing import List, Dict

class LegalDocumentPreprocessor:
    def __init__(self):
        self.legal_patterns = {
            'clauses': r'Section \d+\.?\s*[A-Z][^.]*\.',
            'definitions': r'"[^"]*"\s*means\s*[^.]*\.',
            'obligations': r'(shall|must|will)\s+[^.]*\.',
            'rights': r'(entitled to|right to|may)\s+[^.]*\.'
        }
    
    def extract_legal_elements(self, text: str) -> Dict[str, List[str]]:
        """Extract key legal elements from document"""
        elements = {}
        for element_type, pattern in self.legal_patterns.items():
            elements[element_type] = re.findall(pattern, text, re.IGNORECASE)
        return elements
```

#### Custom Legal Prompts
```python
# legal_prompts.py
LEGAL_ANALYSIS_PROMPT = """
You are a legal AI assistant specializing in Indian law. Analyze the following document and provide:

1. Document Type and Purpose
2. Key Legal Clauses
3. Rights and Obligations
4. Potential Legal Issues
5. Compliance Requirements
6. Recommendations

Document: {context}

Question: {question}

Provide a comprehensive analysis in plain English.
"""
```

### 6. Testing the RAG Integration

#### Test Document Analysis
```python
# test_rag_integration.py
import pytest
from rag_agent import LegalRAGAgent

def test_document_processing():
    rag_agent = LegalRAGAgent()
    # Test with sample legal document
    rag_agent.process_document("sample_contract.pdf")
    
    # Test analysis
    result = rag_agent.analyze_document("What are the main obligations in this contract?")
    assert "obligation" in result["analysis"].lower()
```

### 7. Deployment Considerations

#### Vector Database Persistence
- Use persistent ChromaDB storage for production
- Implement document versioning
- Set up regular backups of the vector database

#### Performance Optimization
- Implement document chunking strategies
- Use appropriate embedding models for legal text
- Cache frequently accessed documents

#### Security
- Implement document access controls
- Encrypt sensitive legal documents
- Use secure API authentication

This RAG integration provides intelligent document analysis capabilities that can understand legal terminology, extract key information, and answer specific questions about uploaded legal documents.

## Testing

### Development Testing
```bash
# Run development server with hot reload
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Customization

### Design System
The app uses a custom design system defined in `src/index.css`:

- **Color Palette**: Aurora Borealis theme with electric cyan and cosmic magenta
- **Typography**: Google Inter font family
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Animations**: Smooth transitions with Framer Motion

### Component Customization
All UI components are built with Radix UI primitives and can be customized by modifying their respective files in `src/components/ui/`.

### Theme Customization
Modify the CSS custom properties in `src/index.css` to customize colors, spacing, and other design tokens.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Security

- **Data Protection**: All sensitive data is handled securely
- **Input Validation**: Client-side validation with Zod schemas
- **HTTPS**: Enforced in production environments
- **CSP**: Content Security Policy headers configured

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test changes thoroughly before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for informational purposes only and does not constitute legal advice. Users should consult with qualified legal professionals for specific legal matters. The AI assistant provides general guidance and should not be relied upon for critical legal decisions.

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions