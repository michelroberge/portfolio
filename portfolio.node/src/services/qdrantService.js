require("dotenv").config();
const { QdrantClient } = require("@qdrant/js-client-rest");
const Embedding = require("../models/Embedding");
const NodeCache = require("node-cache");
const searchCache = new NodeCache({ stdTTL: 300 });
const counterService = require("../services/counterService");
const QDRANT_URL = process.env.QDRANT_URL || "http://10.0.0.42:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://10.0.0.42:11434";
const COLLECTION_NAME = "projects";
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || 1536; // Default to OpenAI size if not set

const qdrantClient = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});
  
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
                size: VECTOR_SIZE, 
                distance: "Cosine"
            }
        });

        console.log(`✅ Qdrant collection "${COLLECTION_NAME}" created.`);
    }
}

/**
 * Stores an embedding in Qdrant and MongoDB.
 * @param {string} filePath - Path of the file being embedded.
 * @param {string} content - File content for embedding generation.
 * @param {object} metadata - Additional metadata related to the embedding.
 */
async function storeEmbedding(filePath, content, metadata = {}) {
    try {
        const vector = await generateEmbedding(content);
        if (!vector) {
            throw new Error("Failed to generate embedding.");
        }

        // Validate vector
        if (!Array.isArray(vector) || vector.length !== VECTOR_SIZE || vector.some(isNaN)) {
            throw new Error(`Invalid embedding vector received.`);
        }

        // Store in MongoDB
        const embeddingEntry = await Embedding.create({ filePath, metadata });

        // Store in Qdrant
        const id = await counterService.getNextVectorId("embedding");
        await qdrantClient.upsert(COLLECTION_NAME, {
            points: [
                {
                    id: id,
                    vector,
                    payload: { filePath, metadata },
                },
            ],
        });

        console.log(`✅ Stored embedding for file: ${filePath}`);
        return embeddingEntry;
    } catch (error) {
        console.error(`❌ Qdrant Error:`, error.message);
        return null;
    }
}

/**
 * Updates metadata for an embedding entry in MongoDB and Qdrant.
 * @param {string} id - The embedding document ID.
 * @param {object} metadata - Updated metadata.
 */
async function updateEmbeddingMetadata(id, metadata) {
    try {
        const embedding = await Embedding.findByIdAndUpdate(id, { metadata }, { new: true });
        if (!embedding) {
            throw new Error("Embedding not found.");
        }

        await qdrantClient.updatePayload(COLLECTION_NAME, {
            points: [{ id }],
            payload: { metadata },
        });

        console.log(`✅ Updated metadata for embedding ID: ${id}`);
        return embedding;
    } catch (error) {
        console.error(`❌ Error updating metadata:`, error.message);
        return null;
    }
}

/**
 * Retrieves all stored embeddings from MongoDB.
 */
async function listEmbeddings() {
    try {
        return await Embedding.find();
    } catch (error) {
        console.error("❌ Error fetching embeddings:", error.message);
        return [];
    }
}

/**
 * Performs a semantic search in Qdrant.
 * @param {number[]} queryVector - The query embedding.
 * @param {string} collection - The collection to search.
 * @param {number} topK - Number of results to retrieve.
 * @param {number} minScore - filter out if score is below this value.
 * @returns {Promise<object[]>} - List of matching projects.
 */
async function searchQdrant(queryVector, collection = "projects", topK = 5, minScore = 0.5, useCache = false) {
    try {

        const cacheKey = `${collection}:${queryVector.slice(0, 5).join(",")}:${topK}:${minScore}`;
        const cachedResults = useCache ? searchCache.get(cacheKey) : null;
        if (cachedResults) {
            console.log(`🔄 Returning cached search results for query.`);
            return cachedResults;
        }

        console.log(`📡 Searching Qdrant in collection "${collection}" with topK=${topK}`);

        // Perform vector search in Qdrant
        const response = await qdrantClient.search(collection, {
            vector: queryVector,
            limit: topK * 2, // Retrieve extra results to allow filtering
            with_payload: true,
            score_threshold: minScore, // Ignore low-score results
        });

        if (!response || response.length === 0) {
            console.log("⚠️ No relevant search results found.");
            return [];
        }

        // Sort results by score (descending) and take only the top K results
        const sortedResults = response
            .filter(doc => doc.score >= minScore) // Remove low-quality matches
            .sort((a, b) => b.score - a.score) // Sort by highest relevance
            .slice(0, topK); // Limit to top K results

        searchCache.set(cacheKey, sortedResults); // Store results in cache

        console.log(`✅ Retrieved ${sortedResults.length} relevant results from Qdrant.`);
        return sortedResults;
    } catch (error) {
        console.error(`❌ Qdrant Search Error: ${error.message}`);
        return [];
    }
}


/**
 * Generates an embedding using Ollama.
 * @param {string} text - The text content to generate an embedding for.
 * @returns {Promise<number[]>} - The generated embedding vector.
 */
async function generateEmbedding(text) {
    try {
        console.log(`📡 Requesting embedding from Ollama for text: "${text.slice(0, 50)}..."`);

        const response = await fetch(`${OLLAMA_URL}api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "mistral", prompt: text }),
        });

        const data = await response.json();
        
        // Log the full response for debugging
        console.log("🔍 Ollama Response:", JSON.stringify(data, null, 2));

        if (!data || !data.embedding || !Array.isArray(data.embedding)) {
            throw new Error("Embedding data is missing or invalid");
        }

        return data.embedding;
    } catch (error) {
        console.error(`❌ Error generating embedding: ${error.message}`);
        return null;
    }
}


/**
 * Deletes the entire Qdrant collection.
 */
async function dropCollection() {
    try {
        await qdrantClient.deleteCollection(COLLECTION_NAME);
        console.log(`✅ Dropped Qdrant collection "${COLLECTION_NAME}"`);
    } catch (error) {
        console.error(`❌ Error dropping collection: ${error.message}`);
    }
}

module.exports = {
    initCollection,
    storeEmbedding,
    updateEmbeddingMetadata,
    listEmbeddings,
    generateEmbedding,
    dropCollection,
    searchQdrant
};
