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

	# Summary Extraction - Concise, 120-word-or-less summary
	summary_prompt = (
		"You are a precise legal document analyzer. Produce a concise, 120-word-or-less summary of the text. "
		"Capture purpose, scope, obligations, context, and key points ONLY if explicitly written in the text. "
		"If an element (e.g., parties, obligations) is absent, simply omit it — do not mention 'not defined' or 'not available.' "
		"Style: clear, professional, compact. No redundant disclaimers. "
		"Return plain text only, not JSON.\n\nText:\n" + context_for_summary
	)
	summary = generate(summary_prompt)
	
	# Enforce 120 word limit on summary
	summary_words = summary.split()
	if len(summary_words) > 120:
		summary = " ".join(summary_words[:120])

	# Term Extraction - Identify all key legal terms with comprehensive explanations
	all_terms: List[Dict[str, str]] = []
	
	# Process each chunk for term extraction
	for i, chunk in enumerate(chunks):
		term_extraction_prompt = (
			"You are a precise legal document analyzer. Identify all key legal terms, acts, doctrines, and phrases explicitly present in the text. "
			"For each term: "
			"- Scan the ENTIRE document for every mention or explanatory phrase. "
			"- Concatenate all relevant definitions, attributes, or conditions into one comprehensive explanation. "
			"- Keep language neutral, factual, and tied strictly to the provided text. "
			"- Never return 'not defined.' If a term is listed but lacks explanation, simply list it without an explanation. "
			"Return STRICT JSON ONLY in this format: "
			'{"terms":[{"term":"...","explanation":"..."}]} '
			"(no prose, no comments, no backticks, no trailing commas).\n\nText:\n" + chunk
		)
		
		try:
			terms_json = generate(term_extraction_prompt)
			# Parse JSON with strict validation
			import json
			parsed = json.loads(terms_json.strip())
			if isinstance(parsed, dict) and "terms" in parsed and isinstance(parsed["terms"], list):
				all_terms.extend(parsed["terms"])
		except (json.JSONDecodeError, KeyError, TypeError):
			# Skip malformed JSON chunks
			continue
	
	# Deduplicate and merge terms with comprehensive explanations
	terms_map = {}
	for term_data in all_terms:
		if isinstance(term_data, dict) and "term" in term_data and "explanation" in term_data:
			term_key = term_data["term"].lower().strip()
			if term_key not in terms_map:
				terms_map[term_key] = term_data
			else:
				# Concatenate explanations from multiple mentions
				existing = terms_map[term_key]["explanation"]
				new_explanation = term_data["explanation"]
				if existing and new_explanation and existing != new_explanation:
					# Combine explanations comprehensively
					terms_map[term_key]["explanation"] = f"{existing} {new_explanation}"
				elif not existing and new_explanation:
					terms_map[term_key]["explanation"] = new_explanation
	
	# Convert to list and limit to top 15 terms
	terms = list(terms_map.values())[:15]

	return AnalyzeResponse(summary=summary, terms=terms)
