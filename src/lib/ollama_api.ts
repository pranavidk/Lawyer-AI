const OLLAMA_BASE_URL = "http://127.0.0.1:11434";

export async function queryOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",   // Updated to use the correct model name
        prompt: prompt,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.trim().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              result += data.response;
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn("Failed to parse JSON line:", line);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error querying Ollama:", error);
    throw error;
  }
}

export async function embedWithOllama(texts: string[], model: string = "nomic-embed-text"): Promise<number[][]> {
  // Embedding model should be available locally: `ollama pull nomic-embed-text`
  const embeddings: number[][] = [];
  for (const text of texts) {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: text })
    });
    if (!res.ok) {
      throw new Error(`Embeddings request failed: ${res.status}`);
    }
    const json = await res.json();
    if (!json || !json.embedding) {
      throw new Error("Invalid embeddings response from Ollama");
    }
    embeddings.push(json.embedding as number[]);
  }
  return embeddings;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm) + 1e-8);
}
