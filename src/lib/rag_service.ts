import { queryOllama, embedWithOllama, cosineSimilarity } from './ollama_api';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// Use Vite's ?url to get a URL string for the worker file
// This avoids passing a module object and fixes runtime worker init
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

export interface DocumentAnalysis {
  summary: string;
  terms: Array<{
    term: string;
    explanation: string;
  }>;
  clauses: Array<{
    clause: string;
    explanation: string;
  }>;
}

export type ProgressPhase =
  | 'reading'
  | 'chunking'
  | 'embedding'
  | 'extracting_terms'
  | 'extracting_clauses'
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
  try {
    GlobalWorkerOptions.workerSrc = pdfWorkerUrl as unknown as string;
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const strings = (content.items as any[]).map((item: any) => item.str as string);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  } catch (e: any) {
    throw new Error(`PDF parsing failed: ${e?.message || 'Unknown error'}`);
  }
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

    // 4) Extract terms and clauses across ALL chunks in batches
    // Terms
    onProgress?.({ phase: 'extracting_terms', message: 'Extracting legal terms...', percent: 0 });
    const termResults: Array<{ term: string; explanation: string }> = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize).join('\n\n');
      const termPrompt = `You are a legal expert. From the following legal text, extract ALL important legal terms and phrases. For each, provide a concise plain-English explanation (max 2–3 sentences). Return STRICT JSON ONLY in this exact structure: {"terms":[{"term":"...","explanation":"..."}]} (object with a single array property). Do not return a bare array. No prose. No comments. No backticks. No trailing commas.\n\nText:\n${batch}`;
      const rawTerms = await withTimeout(queryOllama(termPrompt), 'extracting legal terms');
      const jsonTerms = extractJsonStrict(rawTerms);
      let parsedTerms = safeParseTerms(jsonTerms);
      if (!parsedTerms.terms?.length) {
        // last-resort: extract array items by regex and parse item-wise
        parsedTerms = extractTermsItemsHeuristic(jsonTerms);
      }
      if (parsedTerms?.terms?.length) termResults.push(...parsedTerms.terms);
      onProgress?.({ phase: 'extracting_terms', message: 'Extracting legal terms...', percent: Math.round(((i + batchSize) / chunks.length) * 100) });
    }

    // Clauses
    onProgress?.({ phase: 'extracting_clauses', message: 'Identifying important clauses...', percent: 0 });
    const clauseResults: Array<{ clause: string; explanation: string }> = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize).join('\n\n');
      const clausePrompt = `You are a legal expert. From the following legal text, extract ALL significant legal clauses (obligations, rights, liabilities, termination, payment, confidentiality, etc.). For each, provide a concise explanation in plain English (max 2–3 sentences). Sort by importance within your output. Return STRICT JSON ONLY in this exact structure: {"clauses":[{"clause":"...","explanation":"..."}]} (object with a single array property). Do not return a bare array. No prose. No comments. No backticks. No trailing commas.\n\nText:\n${batch}`;
      const rawClauses = await withTimeout(queryOllama(clausePrompt), 'extracting clauses');
      const jsonClauses = extractJsonStrict(rawClauses);
      let parsedClauses = safeParseClauses(jsonClauses);
      if (!parsedClauses.clauses?.length) {
        parsedClauses = extractClausesItemsHeuristic(jsonClauses);
      }
      if (parsedClauses?.clauses?.length) clauseResults.push(...parsedClauses.clauses);
      onProgress?.({ phase: 'extracting_clauses', message: 'Identifying important clauses...', percent: Math.round(((i + batchSize) / chunks.length) * 100) });
    }

    // Deduplicate and sort by importance proxy (frequency and length)
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const dedupeTermsMap = new Map<string, { term: string; explanation: string; count: number }>();
    for (const t of termResults) {
      const key = normalize(t.term);
      const prev = dedupeTermsMap.get(key);
      if (!prev) dedupeTermsMap.set(key, { ...t, count: 1 }); else prev.count += 1;
    }
    const finalTerms = Array.from(dedupeTermsMap.values())
      .sort((a, b) => (b.count - a.count) || (b.term.length - a.term.length))
      .map(({ term, explanation }) => ({ term, explanation }));

    const dedupeClausesMap = new Map<string, { clause: string; explanation: string; count: number }>();
    for (const c of clauseResults) {
      const key = normalize(c.clause);
      const prev = dedupeClausesMap.get(key);
      if (!prev) dedupeClausesMap.set(key, { ...c, count: 1 }); else prev.count += 1;
    }
    const finalClauses = Array.from(dedupeClausesMap.values())
      .sort((a, b) => (b.count - a.count) || (b.clause.length - a.clause.length))
      .map(({ clause, explanation }) => ({ clause, explanation }));

    // 5) Summary on representative chunks
    onProgress?.({ phase: 'summarizing', message: 'Summarizing document with LLM...', percent: 0 });
    const representative = chunks
      .map((t, idx) => ({ t, idx, len: t.length }))
      .sort((a, b) => b.len - a.len)
      .slice(0, Math.max(5, Math.min(12, Math.floor(chunks.length / 4))))
      .map(x => x.t)
      .join('\n\n');
    const summaryPrompt = `You are a legal document analyzer. Summarize the document in 5-7 sentences, focusing on purpose, scope, parties, obligations, and overall meaning. Keep it precise and plain English.\n\nText:\n${representative}`;
    const summaryRaw = await withTimeout(queryOllama(summaryPrompt), 'summary');
    const summary = summaryRaw.trim();
    onProgress?.({ phase: 'summarizing', message: 'Summary generated', percent: 100 });

    return { summary, terms: finalTerms, clauses: finalClauses };
  }
}

export const ragAgent = new RAGAgent();

// --- JSON extraction/repair helpers ---
function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith('```')) {
    // remove opening fence and optional language tag
    t = t.replace(/^```[a-zA-Z0-9]*\n?/, '');
  }
  if (t.endsWith('```')) {
    t = t.replace(/```\s*$/, '');
  }
  return t.trim();
}

function extractJsonStrict(text: string): string {
  const t = stripCodeFences(text);
  // attempt balanced brace extraction
  let started = false;
  let depth = 0;
  let startIdx = -1;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (!started) {
      if (ch === '{') {
        started = true;
        depth = 1;
        startIdx = i;
      }
    } else {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return t.slice(startIdx, i + 1);
        }
      }
    }
  }
  // fallback: return entire trimmed text
  return t;
}

function parseJsonWithRepairs(text: string): unknown {
  const candidates: string[] = [];
  const t0 = text.trim();
  candidates.push(t0);
  candidates.push(stripTrailingCommas(t0));
  candidates.push(replaceSmartQuotes(stripTrailingCommas(t0)));
  // Sometimes models use single-quoted JSON; convert to double quotes cautiously
  candidates.push(toDoubleQuotedJson(stripTrailingCommas(t0)));

  let lastErr: unknown = null;
  for (const c of candidates) {
    try {
      return JSON.parse(c);
    } catch (e) {
      lastErr = e;
    }
  }
  // As a last attempt, try to locate first '{' and last '}' and apply repairs
  const first = t0.indexOf('{');
  const last = t0.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const sliced = t0.slice(first, last + 1);
    try {
      return JSON.parse(replaceSmartQuotes(stripTrailingCommas(toDoubleQuotedJson(sliced))));
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`Failed to parse model JSON: ${String(lastErr)}`);
}

function stripTrailingCommas(text: string): string {
  // remove trailing commas before } or ]
  return text.replace(/,(\s*[}\]])/g, '$1');
}

function replaceSmartQuotes(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"');
}

function toDoubleQuotedJson(text: string): string {
  // Replace single-quoted keys/strings with double-quoted if the text looks like JSON
  // This is a conservative replacement to avoid damaging real JSON
  let t = text;
  // keys: 'key': -> "key":
  t = t.replace(/'([A-Za-z0-9_\-]+)'\s*:/g, '"$1":');
  // string values: : 'value' -> : "value"
  t = t.replace(/:\s*'([^']*)'/g, ': "$1"');
  return t;
}

function coerceTerms(parsed: any): { terms?: Array<{ term: string; explanation: string }> } {
  if (Array.isArray(parsed)) {
    return { terms: parsed };
  }
  if (parsed && Array.isArray(parsed.terms)) {
    return { terms: parsed.terms };
  }
  // if model returned { items: [...] }
  if (parsed && Array.isArray(parsed.items)) {
    return { terms: parsed.items };
  }
  return { terms: [] };
}

function coerceClauses(parsed: any): { clauses?: Array<{ clause: string; explanation: string }> } {
  if (Array.isArray(parsed)) {
    return { clauses: parsed };
  }
  if (parsed && Array.isArray(parsed.clauses)) {
    return { clauses: parsed.clauses };
  }
  if (parsed && Array.isArray(parsed.items)) {
    return { clauses: parsed.items };
  }
  return { clauses: [] };
}

function safeParseTerms(text: string): { terms?: Array<{ term: string; explanation: string }> } {
  try {
    return coerceTerms(parseJsonWithRepairs(text));
  } catch {
    return { terms: [] };
  }
}

function safeParseClauses(text: string): { clauses?: Array<{ clause: string; explanation: string }> } {
  try {
    return coerceClauses(parseJsonWithRepairs(text));
  } catch {
    return { clauses: [] };
  }
}

function extractTermsItemsHeuristic(text: string): { terms?: Array<{ term: string; explanation: string }> } {
  const items: Array<{ term: string; explanation: string }> = [];
  // Find patterns like {"term":"...","explanation":"..."}
  const regex = /\{\s*"term"\s*:\s*"([\s\S]*?)"\s*,\s*"explanation"\s*:\s*"([\s\S]*?)"\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    items.push({ term: sanitizeInline(m[1]), explanation: sanitizeInline(m[2]) });
  }
  return { terms: items };
}

function extractClausesItemsHeuristic(text: string): { clauses?: Array<{ clause: string; explanation: string }> } {
  const items: Array<{ clause: string; explanation: string }> = [];
  const regex = /\{\s*"clause"\s*:\s*"([\s\S]*?)"\s*,\s*"explanation"\s*:\s*"([\s\S]*?)"\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    items.push({ clause: sanitizeInline(m[1]), explanation: sanitizeInline(m[2]) });
  }
  return { clauses: items };
}

function sanitizeInline(s: string): string {
  // collapse newlines and escape sequences that might break JSON items
  return s.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
}
