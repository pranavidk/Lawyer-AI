import { queryOllama, embedWithOllama, cosineSimilarity } from './ollama_api';

export interface DocumentAnalysis {
  summary: string;
  keyTerms: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  clauses: Array<{
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
}

export type ProgressPhase =
  | 'reading'
  | 'chunking'
  | 'embedding'
  | 'retrieving'
  | 'summarizing';

export interface ProgressUpdate {
  phase: ProgressPhase;
  message: string;
  percent?: number;
}

interface VectorChunk {
  text: string;
  embedding: number[];
  index: number;
}

function splitTextRecursive(text: string, chunkSize = 2000, overlap = 250): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);
    const slice = text.slice(start, end);
    let lastPeriod = slice.lastIndexOf('.');
    if (lastPeriod > chunkSize * 0.6) {
      end = start + lastPeriod + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(c => c.length > 0);
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib: any = await import('pdfjs-dist');
  const worker: any = await import('pdfjs-dist/build/pdf.worker.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }
  return fullText;
}

async function extractPlainText(file: File): Promise<string> {
  return await file.text();
}

export class RAGAgent {
  async analyzeDocument(
    file: File,
    onProgress?: (u: ProgressUpdate) => void,
    options?: { timeoutMs?: number; topK?: number }
  ): Promise<DocumentAnalysis> {
    const timeoutMs = options?.timeoutMs ?? 120_000;
    const topK = options?.topK ?? 6;

    const withTimeout = async <T>(p: Promise<T>, msg: string): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout while ${msg}`)), timeoutMs);
        p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
      });
    };

    // 1) Extract
    onProgress?.({ phase: 'reading', message: 'Reading document...' });
    let rawText = '';
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      rawText = await withTimeout(extractPdfText(file), 'reading PDF');
    } else {
      rawText = await withTimeout(extractPlainText(file), 'reading file');
    }
    if (!rawText || rawText.trim().length < 10) {
      throw new Error('Could not read this document or it is empty.');
    }

    // 2) Chunk
    onProgress?.({ phase: 'chunking', message: 'Chunking document...' });
    const chunks = splitTextRecursive(rawText, 2000, 250);

    // 3) Embed in batches
    onProgress?.({ phase: 'embedding', message: 'Generating embeddings...', percent: 0 });
    const batchSize = 8;
    const vectorChunks: VectorChunk[] = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await withTimeout(embedWithOllama(batch), 'generating embeddings');
      embeddings.forEach((emb, idx) => {
        vectorChunks.push({ text: batch[idx], embedding: emb, index: i + idx });
      });
      onProgress?.({ phase: 'embedding', message: 'Generating embeddings...', percent: Math.round(((i + batch.length) / chunks.length) * 100) });
    }

    // 4) Retrieve
    onProgress?.({ phase: 'retrieving', message: 'Retrieving relevant sections...' });
    const retrievalQuery = 'Summarize and explain key legal terms and clauses in this document.';
    const [queryEmbedding] = await withTimeout(embedWithOllama([retrievalQuery]), 'query embedding');
    const scored = vectorChunks.map(vc => ({ vc, score: cosineSimilarity(vc.embedding, queryEmbedding) }));
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK).map(s => s.vc.text).join('\n\n');

    // 5) Summarize
    onProgress?.({ phase: 'summarizing', message: 'Summarizing document with LLM...' });
    const prompt = `You are JuriSense AI. Based ONLY on the provided document excerpts, produce a structured JSON analysis with fields: summary (plain English), keyTerms (term, definition, importance), clauses (title, description, riskLevel), recommendations (array). Keep it faithful to the text.\n\nDocument excerpts:\n${top}\n`;

    const result = await withTimeout(queryOllama(prompt), 'summarization');

    // Extract JSON if extra text present
    let jsonText = result.trim();
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.slice(firstBrace, lastBrace + 1);
    }
    const analysis: DocumentAnalysis = JSON.parse(jsonText);
    return analysis;
  }
}

export const ragAgent = new RAGAgent();
