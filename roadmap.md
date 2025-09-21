# Hackathon Roadmap: Privacy-Focused Legal AI Assistant

This roadmap outlines the 48-hour development plan for building an AI assistant focused on legal awareness in India, emphasizing privacy, local deployment, and user-friendly features. The project uses RAG (Retrieval-Augmented Generation) and fine-tuning on open-source models, with a focus on contract analysis and legal term explanations.

## Phase 0: Pre-Hackathon Prep (Optional, Before Start)
- Set up GitHub repo, Slack/Discord channel, and Notion/Trello board for team collaboration.
- Gather open-source legal datasets (India-specific, e.g., Bare Acts, Indian Penal Code, IT Act, Contract Act).
- Identify a base open-source model (e.g., LLaMA 3, Mistral, or Falcon fine-tuned for legal/finance domains).

## Day 1: Hours 0–24
### Hours 0–4 (Team of 2) – Kickoff
- Define problem statement and value proposition: “AI assistant for legal awareness in India.”
- Decide scope: Focus on contract clause analysis and legal term explanations.
- Set up infrastructure:
  - GitHub repo with branch protection.
  - Local dev environment and optional cloud (Hugging Face, Colab, or Replicate).
  - Select base model and vector DB (e.g., FAISS or ChromaDB).

### Hours 4–12 (Team Grows to 4) – Core RAG Agent
- Build RAG pipeline:
  - Ingest legal text corpus (Bare Acts, sample contracts).
  - Chunk and embed using OpenAI embeddings (cloud) or sentence-transformers (local).
  - Store in FAISS/Chroma for retrieval.
  - Implement simple retrieval and summary generation.
- Demo use case: Upload a sample contract → Output highlights risky clauses and provides plain-English summary.
- Milestone: Working RAG prototype with sample queries by Hour 12.

### Hours 12–18 – Fine-Tuning / LoRA Setup
- Select a small open-source model (max 7B scale for speed).
- Fine-tune using LoRA/PEFT on:
  - Indian legal glossary (terms and explanations).
  - Compliance Q&A dataset (e.g., GST, IT Act basics).
- Backup plan: Use prompt-engineering templates if compute is limited.
- Milestone: Fine-tuned model (or strong prompts) ready for term explanations by Hour 18.

### Hours 18–24 – Web App MVP
- Build minimal frontend (Next.js / React) with input box for questions or contract uploads.
- Include tabs: "Clause Analysis" | "Legal Term Explanation".
- Set up backend (FastAPI/Flask) to serve RAG and fine-tuned model.
- Ensure privacy: Support local mode (PC install) and cloud mode toggle.
- Milestone: MVP working locally by end of Day 1.

## Day 2: Hours 24–48
### Hours 24–32 – UX & Gen-Z/Millennial Friendly Layer
- Add chatbot UI with Gen-Z tone options (formal vs. casual explanations).
- Use bullet points and emojis in summaries for younger users.
- Prominently display “Not Legal Advice” disclaimer.

### Hours 32–40 – Security & Privacy
- Implement local-only mode for all processing on user’s PC.
- For cloud mode: Encrypt query logs and ensure no data storage.
- Document privacy-first approach in README and demo pitch.

### Hours 40–44 – Polish & Testing
- Test with 2–3 sample contracts (e.g., employment, rental, NDA).
- Test legal term queries (e.g., “What is force majeure?”).
- Fix UX bugs and ensure smooth performance on laptops.

### Hours 44–48 – Pitch & Demo Prep
- Develop storyline: "Legal awareness for India, across generations – privacy-first, flexible local/cloud deployment, educational tool (not a lawyer replacement)."
- Prepare demo flow: Upload rental contract → Highlight risky clause; Ask “What does indemnity mean?” → Friendly explanation.
- Create 2–3 slides covering problem, solution, architecture, and impact.
