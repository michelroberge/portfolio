// portfolio.node/src/services/ollamaService.js

const OLLAMA_URL = process.env.OLLAMA_URL || "http://10.0.0.42:11434";
const PROMPT_MODEL = process.env.PROMPT_MODEL || "mistral";

/**
 * Sends a structured prompt to the Ollama AI model and retrieves a response.
 * @param {string} prompt - The structured prompt with context and user query.
 * @param {string} format - Response format ('json' or 'text')
 * @returns {Promise<{ response: string }>} - AI-generated response.
 */
async function generateResponse(prompt) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: PROMPT_MODEL,
        prompt: `${prompt}`,
        max_tokens: 200,
        temperature: 0.7,
        format: 'json'
      }),
    });

    if (!response.ok) {
      throw new Error(`⚠️ API returned an error: ${response.statusText}`);
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
  const url = `${OLLAMA_URL}/api/generate`;

  const options = format == 'text' ? 
      {
        model: PROMPT_MODEL,
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7,
        stream: true,  
        options: {
          skip_model_details: true 
        }
      } :
    {
      model: PROMPT_MODEL,
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
      format: format,
      stream: false,  
      options: {
        num_ctx: 2048,  // Add any other options you need
        skip_model_details: true  // This will exclude model details
      }
    };

  console.log(`REQUEST STREAMING`);

  const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
  });

  console.log(`START STREAMING`);
  const reader = response.body.getReader();

  return new ReadableStream({
      async start(controller) {
          let accumulatedResponse = "";

          while (true) {
              const { done, value } = await reader.read();
              if (done) {
                  controller.close();
                  break;
              }

              const chunk = new TextDecoder().decode(value);
              chunk.split("\n").forEach((line) => {
                  if (line.trim()) {
                      try {
                          const parsed = JSON.parse(line);
                          if (parsed.response) {
                              accumulatedResponse += parsed.response;
                              controller.enqueue(parsed.response);
                          }
                      } catch (err) {
                          // For text format, try to use the raw chunk
                          if (format === 'text') {
                              controller.enqueue(line.trim());
                          } else {
                              console.warn("Skipping invalid JSON chunk");
                          }
                      }
                  }
              });
          }
      }
  });
}

module.exports = { generateResponse, generateResponseStream };
