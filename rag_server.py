import io
import os
import hashlib
from typing import List, Dict, Any

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Optional dependencies
try:
	import chromadb  # type: ignore
	from chromadb.config import Settings  # type: ignore
	CHROMA_AVAILABLE = True
except Exception:
	CHROMA_AVAILABLE = False

import requests

# Text splitting
def recursive_split(text: str, chunk_size: int = 1000, overlap: int = 150) -> List[str]:
	chunks: List[str] = []
	start = 0
	length = len(text)
	while start < length:
		end = min(start + chunk_size, length)
		slice_ = text[start:end]
		last_period = slice_.rfind('.')
		if last_period > int(chunk_size * 0.5):
			end = start + last_period + 1
		chunk = text[start:end].strip()
		if chunk:
			chunks.append(chunk)
		start = max(end - overlap, start + 1)
	return chunks

# PDF/Text extraction
def extract_text_from_pdf(data: bytes) -> str:
	try:
		from PyPDF2 import PdfReader  # lightweight dependency
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"PDF backend missing: {e}")
	reader = PdfReader(io.BytesIO(data))
	texts: List[str] = []
	for page in reader.pages:
		try:
			texts.append(page.extract_text() or "")
		except Exception:
			continue
	return "\n".join(texts)

# Ollama endpoints
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://127.0.0.1:11434")
GEN_MODEL = os.environ.get("OLLAMA_GEN_MODEL", "llama3.2:latest")
EMB_MODEL = os.environ.get("OLLAMA_EMB_MODEL", "nomic-embed-text")


def embed_texts(texts: List[str]) -> List[List[float]]:
	embeddings: List[List[float]] = []
	for t in texts:
		resp = requests.post(
			f"{OLLAMA_BASE}/api/embeddings",
			json={"model": EMB_MODEL, "prompt": t},
			timeout=120,
		)
		if not resp.ok:
			raise HTTPException(status_code=502, detail=f"Embedding failed: {resp.status_code}")
		data = resp.json()
		if "embedding" not in data:
			raise HTTPException(status_code=502, detail="Invalid embedding response")
		embeddings.append(data["embedding"])  # type: ignore
	return embeddings


def generate(prompt: str) -> str:
	resp = requests.post(
		f"{OLLAMA_BASE}/api/generate",
		json={"model": GEN_MODEL, "prompt": prompt, "stream": False},
		timeout=300,
	)
	if not resp.ok:
		raise HTTPException(status_code=502, detail=f"Generation failed: {resp.status_code}")
	data = resp.json()
	return data.get("response", "").strip()


def cosine(a: List[float], b: List[float]) -> float:
	import math
	dot = 0.0
	a_n = 0.0
	b_n = 0.0
	for x, y in zip(a, b):
		dot += x * y
		a_n += x * x
		b_n += y * y
	den = math.sqrt(a_n) * math.sqrt(b_n) + 1e-8
	return dot / den


class AnalyzeResponse(BaseModel):
	summary: str
	terms: List[Dict[str, str]]


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
async def health() -> Any:
	return {"status": "ok", "model": GEN_MODEL, "embed": EMB_MODEL}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(file: UploadFile = File(...)) -> Any:
	name = (file.filename or "uploaded").lower()
	data = await file.read()
	if not data:
		raise HTTPException(status_code=400, detail="Empty file")

	# Extract text
	if name.endswith(".pdf") or file.content_type == "application/pdf":
		text = extract_text_from_pdf(data)
	else:
		try:
			text = data.decode("utf-8", errors="ignore")
		except Exception:
			raise HTTPException(status_code=400, detail="Unsupported text encoding")
	if not text or len(text.strip()) < 10:
		raise HTTPException(status_code=422, detail="Could not read this document or it is empty")

	# Chunk
	chunks = recursive_split(text, chunk_size=1200, overlap=200)
	if not chunks:
		raise HTTPException(status_code=422, detail="No readable content found")

	# Embeddings
	chunk_embeddings = embed_texts(chunks)

	# Vector store (Chroma or simple fallback)
	doc_id = hashlib.sha256(data).hexdigest()[:12]

	if CHROMA_AVAILABLE:
		client = chromadb.Client(Settings(persist_directory="./chroma_store"))
		collection = client.get_or_create_collection(name=f"doc_{doc_id}")
		# Avoid re-embedding if already present
		if collection.count() == 0:
			collection.add(
				documents=chunks,
				embeddings=chunk_embeddings,
				ids=[f"{doc_id}_{i}" for i in range(len(chunks))],
			)
		# Retrieve top documents for summary & terms context
		query = "Summarize and extract important legal terms"
		q_emb = embed_texts([query])[0]
		res = collection.query(query_embeddings=[q_emb], n_results=8)
		retrieved_docs = res.get("documents", [[]])[0]
		context_for_summary = "\n\n".join(retrieved_docs)
	else:
		# Fallback: cosine search in memory
		query = "Summarize and extract important legal terms"
		q_emb = embed_texts([query])[0]
		scored = [(i, cosine(e, q_emb)) for i, e in enumerate(chunk_embeddings)]
		scored.sort(key=lambda x: x[1], reverse=True)
		retrieved_docs = [chunks[i] for i, _ in scored[:8]]
		context_for_summary = "\n\n".join(retrieved_docs)

	# Summary
	summary_prompt = (
		"You are a legal document analyzer. Summarize the document clearly and concisely in plain English. "
		"Include only information explicitly present in the text. "
		"Do not add outside knowledge, interpretations, or assumptions. "
		"The summary must be brief (maximum 120 words). "
		"If key details such as purpose, scope, parties, or obligations are missing, explicitly state 'Not mentioned in the text.' "
		"Keep the explanation precise and factual.\n\nText:\n" + context_for_summary
	)
	summary = generate(summary_prompt)

	# Extract key legal terms from the summary using LLM
	extract_terms_prompt = (
		"You are a legal expert. From the following summary, extract ONLY the key legal terms and phrases mentioned. "
		"Return a simple list, one term per line, without explanations. Be concise and accurate.\n\n"
		"SUMMARY:\n" + summary + "\n\n"
		"List of key legal terms:"
	)
	terms_list_text = generate(extract_terms_prompt)
	
	# Parse the terms list
	term_names = []
	for line in terms_list_text.splitlines():
		line = line.strip()
		if line and not line.startswith("#") and not line.startswith("-"):
			# Clean up the term (remove numbering, bullets, etc.)
			term = line.replace("•", "").replace("*", "").replace("-", "").strip()
			# Remove leading numbers like "1. " or "1) "
			import re
			term = re.sub(r'^\d+[\.\)]\s*', '', term)
			if term and len(term) > 2:
				term_names.append(term)
	
	# Get explanations for each term using ONLY the document text
	terms: List[Dict[str, str]] = []
	for term_name in term_names[:10]:  # Limit to top 10 terms to avoid overwhelming
		explain_prompt = (
			f"Explain this legal term using ONLY information explicitly present in the document text below. "
			f"Do not add any outside knowledge, interpretations, or assumptions. "
			f"Use only what is directly stated in the text. "
			f"If the term is not explained in the text, state 'Not defined in the document.' "
			f"Keep the explanation brief (maximum 50 words) and factual.\n\n"
			f"Term: {term_name}\n\n"
			f"Document text:\n{context_for_summary}\n\n"
			f"Explanation based only on document text:"
		)
		explanation = generate(explain_prompt).strip()
		if explanation and len(explanation) > 10:  # Only add if we got a meaningful explanation
			terms.append({"term": term_name, "explanation": explanation})

	return AnalyzeResponse(summary=summary, terms=terms)
