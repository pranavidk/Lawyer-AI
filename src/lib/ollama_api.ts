export async function queryOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",   // change if you use another model
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
