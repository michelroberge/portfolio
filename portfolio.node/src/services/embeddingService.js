const EMBEDDING_SERVICE = process.env.EMBEDDING_SERVICE?.toLowerCase() || "ollama"; // Default to Ollama
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "mistral"; // Default model for Ollama
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || (EMBEDDING_SERVICE === "openai" ? 1536 : 4096);
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OPENAI_API_URL = "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure API key is set for OpenAI

async function generateEmbeddings(text) {
  if (EMBEDDING_SERVICE === "openai") {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in your .env file.");
    }
    return generateOpenAIEmbeddings(text);
  }
  return generateOllamaEmbeddings(text); // Default to Ollama
}

async function generateOllamaEmbeddings(text) {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: EMBEDDING_MODEL, // Dynamically set from .env
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.embedding.length !== VECTOR_SIZE) {
      throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.embedding.length}`);
    }
    return data.embedding;
  } catch (error) {
    console.error("Error generating embeddings with Ollama:", error);
    throw new Error("Failed to generate embeddings with Ollama.");
  }
}

async function generateOpenAIEmbeddings(text) {
  try {
    const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002", // Ensure correct OpenAI model
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.data[0].embedding.length !== VECTOR_SIZE) {
      throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.data[0].embedding.length}`);
    }
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embeddings with OpenAI:", error);
    throw new Error("Failed to generate embeddings with OpenAI.");
  }
}

module.exports = {
  generateEmbeddings,
};
