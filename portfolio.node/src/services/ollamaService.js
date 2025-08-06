// portfolio.node/src/services/ollamaService.js

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://10.0.0.57:11434";
const PROMPT_MODEL = process.env.PROMPT_MODEL || "mistral";
const TEMPERATURE = process.env.MODEL_TEMPERATURE || 0.4;

/**
 * Sends a structured prompt to the Ollama AI model and retrieves a response.
 * @param {string} prompt - The structured prompt with context and user query.
 * @param {string} format - Response format ('json' or 'text')
 * @returns {Promise<{ response: string }>} - AI-generated response.
 */
async function generateResponse(prompt) {
  try {
    console.log("checking url:", `${OLLAMA_API_URL}/api/generate`);
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: PROMPT_MODEL,
        prompt: `${prompt}`,
        max_tokens: 200,
        temperature: TEMPERATURE,
        format: 'json',
      }),
    });

    if (!response.ok) {
      // throw new Error(`⚠️ API returned an error: ${response.statusText}`);
      console.error(`⚠️ API returned an error: ${response.statusText}`);
      return { response: "I'm having trouble generating a response right now. Try again later." };
    }

    // Read the response as a stream
    const reader = response.body.getReader();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Convert chunk to string
      const chunk = new TextDecoder().decode(value);
      
      // Process each JSON object (one per line)
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullResponse += parsed.response; // Append each part of the response
            }
          } catch (err) {
            console.warn("Skipping invalid JSON chunk");
          }
        }
      });
    }

    return { response: fullResponse.trim() || "No response generated." };
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    return { response: "I'm having trouble generating a response right now. Try again later." };
  }
}

/**
 * Streams a response from Ollama
 * @param {string} prompt - The prompt to send to Ollama
 * @param {string} format - Response format ('json' or 'text')
 * @returns {ReadableStream} A stream of response chunks
 */
async function generateResponseStream(prompt, format = 'text') {
  const url = `${OLLAMA_API_URL}/api/generate`;

  const options = {
    model: PROMPT_MODEL,
    prompt,
    max_tokens: 200,
    temperature: TEMPERATURE,
    format: format !== 'text' ? format : undefined,
    stream: format === 'text',
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  const reader = response.body.getReader();

  return new ReadableStream({
    async start(controller) {
      processStream(reader, controller);
    }
  });
}

async function processStream(reader, controller){

  let accumulatedChunk = ""; // Stores raw chunk data
  let responseBuffer = ""; // Stores words to send

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (responseBuffer.trim().length > 0) {
        controller.enqueue(responseBuffer); // Ensure final response is cleaned
      }
      controller.close();
      break;
    }

    accumulatedChunk += new TextDecoder().decode(value);

    try {
      const parsedData = JSON.parse(accumulatedChunk);
      if (parsedData?.response) {
        const cleanText = parsedData.response; // Remove leading/trailing spaces
        responseBuffer += cleanText;
        controller.enqueue(responseBuffer);
        responseBuffer = ""; // Reset buffer to avoid duplication
      }
      accumulatedChunk = ""; // Reset after parsing successful JSON
    } catch (e) {
      // Keep accumulating if JSON is incomplete
    }
  }
}


module.exports = { generateResponse, generateResponseStream };
