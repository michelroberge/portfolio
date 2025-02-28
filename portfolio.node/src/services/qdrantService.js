require("dotenv").config();
const { QdrantClient } = require("@qdrant/js-client-rest");

const QDRANT_URL = process.env.QDRANT_URL || "http://10.0.0.42:6333";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://10.0.0.42:11434";
const COLLECTION_NAME = "projects";

const qdrantClient = new QdrantClient({ url: QDRANT_URL });

/**
 * Initializes the Qdrant collection if it does not exist.
 */
async function initCollection() {
  try {
    await qdrantClient.getCollection(COLLECTION_NAME);
    console.log(`✅ Qdrant collection "${COLLECTION_NAME}" already exists.`);
  } catch (error) {
    console.log(`⚠️ Qdrant collection "${COLLECTION_NAME}" not found. Creating...`);

    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 4096, // OpenAI-compatible embedding size (modify as needed)
        distance: "Cosine"
      }
    });

    console.log(`✅ Qdrant collection "${COLLECTION_NAME}" created.`);
  }
}

/**
 * Stores a project embedding in Qdrant.
 * @param {string} id - The project ID.
 * @param {string} text - The text content to embed.
 * @param {number[]} vector - The embedding vector.
 */
async function storeEmbedding(id, text, vector) {
    try {
      // Validate vector
      if (!Array.isArray(vector)) {
        throw new Error(`Vector is not an array: ${typeof vector}`);
      }
      
      if (vector.length !== 4096) {
        throw new Error(`Vector length mismatch: expected 4096, got ${vector.length}`);
      }
      
      // Validate that all values are numbers
      const allNumbers = vector.every(val => typeof val === 'number' && !isNaN(val));
      if (!allNumbers) {
        throw new Error('Vector contains non-numeric values');
      }
  
      console.log(`📡 Storing embedding: ID=${id}, Vector Length=${vector.length}`);
      
      // Convert id to string if it's not already
      const pointId = typeof id === 'string' ? id : String(id);
      
      // For testing, use a simple numeric ID
      const testId = Math.floor(Math.random() * 1000000);
      await qdrantClient.upsert(COLLECTION_NAME, {
        points: [
          {
            id: testId,
            vector: vector,
            payload: { text }
          }
        ]
      });
  
      console.log(`✅ Stored embedding for project ${id}`);
    } catch (error) {
      console.error(`❌ Qdrant Error:`, error.response?.data || error.message);
      
      // Log more details about the vector for debugging
      if (vector) {
        console.error(`Vector sample (first 5 elements):`, vector.slice(0, 5));
      }
    }
  }

/**
 * Performs a semantic search in Qdrant.
 * @param {number[]} queryVector - The query embedding.
 * @param {string} collection - The sollection to search.
 * @param {number} topK - Number of results to retrieve.
 * @returns {Promise<object[]>} - List of matching projects.
 */
async function searchQdrant(queryVector, collection, topK = 5) {
    try {
      console.log(`📡 Searching Qdrant in collection "${collection}"`);
      
      const response = await qdrantClient.search(collection, {
        vector: queryVector,
        limit: topK
      });
  
      return response || [];
    } catch (error) {
      console.error(`❌ Qdrant Search Error: ${error.message}`);
      return [];
    }
  }
  
async function generateEmbedding(text) {
    try {
      const response = await fetch(`${OLLAMA_URL}api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "mistral", prompt: text })
      });
  
      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function dropCollection() {
    try {
      await qdrantClient.deleteCollection(COLLECTION_NAME);
      console.log(`✅ Dropped Qdrant collection "${COLLECTION_NAME}"`);
    } catch (error) {
      console.error(`❌ Error dropping collection: ${error.message}`);
    }
  }
  
  
module.exports = { initCollection, storeEmbedding, generateEmbedding, dropCollection, searchQdrant };
