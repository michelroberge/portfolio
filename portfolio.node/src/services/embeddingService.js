const fetch = require("node-fetch");

const EMBEDDING_SERVICE = process.env.EMBEDDING_SERVICE?.toLowerCase() || "ollama"; // Default to Ollama
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "mistral"; // Default model for Ollama
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || (EMBEDDING_SERVICE === "openai" ? 1536 : 4096);
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://10.0.0.57:11434";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1";

/**
 * Generate embeddings for a given text using the configured embedding service.
 * @param {string} text - Input text for embedding
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbeddings(text) {
    if (!text || text.trim().length === 0) throw new Error("Text input is required for embedding.");

    return EMBEDDING_SERVICE === "openai" ? generateOpenAIEmbeddings(text) : generateOllamaEmbeddings(text);
}

/**
 * Generate embeddings using Ollama API.
 * @param {string} text - Input text for embedding
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateOllamaEmbeddings(text) {
    try {
        console.log(`Generating embeddings with Ollama endpoint using model ${EMBEDDING_MODEL}`, `${OLLAMA_API_URL}/api/embeddings`);
        const response = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
        });

        if (!response.ok) throw new Error(`Ollama API Error: ${response.statusText}`);

        const data = await response.json();
        if (!data.embedding || data.embedding.length !== VECTOR_SIZE) {
            throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.embedding?.length}`);
        }

        return data.embedding;
    } catch (error) {
        console.error("❌ Error generating embeddings with Ollama:", error.message);
        throw new Error("Failed to generate embeddings with Ollama.");
    }
}

/**
 * Generate embeddings using OpenAI API.
 * @param {string} text - Input text for embedding
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateOpenAIEmbeddings(text) {
    if (!OPENAI_API_KEY) throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in your .env file.");

    try {
        const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ model: "text-embedding-ada-002", input: text }),
        });

        if (!response.ok) throw new Error(`OpenAI API Error: ${response.statusText}`);

        const data = await response.json();
        if (!data.data || !data.data[0].embedding || data.data[0].embedding.length !== VECTOR_SIZE) {
            throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.data[0].embedding?.length}`);
        }

        return data.data[0].embedding;
    } catch (error) {
        console.error("❌ Error generating embeddings with OpenAI:", error.message);
        throw new Error("Failed to generate embeddings with OpenAI.");
    }
}

module.exports = { generateEmbeddings };
