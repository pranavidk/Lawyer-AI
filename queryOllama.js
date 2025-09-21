async function queryOllama(prompt) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama2",   // change if you use another model
      prompt: prompt
    })
  });

  const reader = response.body.getReader();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    const lines = chunk.trim().split("\n");
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          result += data.response;
        }
      } catch (e) {}
    }
  }
  return result;
}
