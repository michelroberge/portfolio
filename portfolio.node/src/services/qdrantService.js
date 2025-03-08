require("dotenv").config();
const { QdrantClient } = require("@qdrant/js-client-rest");
const Embedding = require("../models/Embedding");
const NodeCache = require("node-cache");
const searchCache = new NodeCache({ stdTTL: 300 });
const counterService = require("../services/counterService");
const QDRANT_URL = process.env.QDRANT_URL || "http://10.0.0.42:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const COLLECTION_NAME = "projects";
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || 4096; // Default to OpenAI size if not set

const qdrantClient = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});
  
/**
 * Initializes the Qdrant collection if it does not exist.
 */
async function initCollection(collection) {
    try {
        await qdrantClient.getCollection(collection);
        console.log(`✅ Qdrant collection "${collection}" already exists.`);
    } catch (error) {
        console.log(`⚠️ Qdrant collection "${collection}" not found. Creating...`);

        await qdrantClient.createCollection(collection, {
            vectors: {
                size: VECTOR_SIZE, 
                distance: "Cosine"
            }
        });

        console.log(`✅ Qdrant collection "${collection}" created.`);
    }
}

/**
 * Stores an embedding in Qdrant and MongoDB.
 * @param {string} filePath - Path of the file being embedded.
 * @param {string} content - File content for embedding generation.
 * @param {object} metadata - Additional metadata related to the embedding.
 */
async function storeEmbedding(collectionName, filePath, vectors, metadata = {}) {
    try {
        // Validate vector
        if (!Array.isArray(vectors) || vectors.length !== VECTOR_SIZE) {
            throw new Error(`Invalid embedding vector received.`);
        }

        // Store in MongoDB
        const id = await counterService.getNextVectorId(`${collectionName}VectorId`);
        const embeddingEntry = await Embedding.create({ filePath, metadata, externalId: id });

        // Store in Qdrant
        await qdrantClient.upsert(collectionName, {
            points: [
                {
                    id: id,
                    vectors,
                    payload: { filePath, metadata },
                },
            ],
        });

        console.log(`✅ Stored '${collectionName}' embedding ${id}`);
        return embeddingEntry;
    } catch (error) {
        console.error(error);
        // console.error(`❌ Qdrant Error:`, error.message);
        return null;
    }
}

/**
 * Updates metadata for an embedding entry in MongoDB and Qdrant.
 * @param {object} payload - The embedding document by id or name and the metadata.
 */
async function updateEmbeddingMetadata({ id = null, filePath = null, metadata }) {
    try {
        let embeddings;

        if (id) {
            // ✅ Update a single embedding by ID
            embeddings = await Embedding.find({ externalId: id });
            if (embeddings.length === 0) throw new Error("Embedding not found.");
        } else if (filePath) {
            // ✅ Update all embeddings for a filePath
            embeddings = await Embedding.find({ filePath });
            if (embeddings.length === 0) throw new Error("No embeddings found for file.");
        } else {
            throw new Error("Either id or filePath must be provided.");
        }

        // ✅ Update metadata in MongoDB
        await Embedding.updateMany({ _id: { $in: embeddings.map(e => e._id) } }, { metadata });

        // ✅ Update in Qdrant
        await qdrantClient.updatePayload(COLLECTION_NAME, {
            points: embeddings.map(e => e.externalId), // Ensure IDs are updated correctly
            payload: { metadata },
        });

        console.log(`✅ Updated metadata for ${embeddings.length} embeddings.`);
        return embeddings;
    } catch (error) {
        console.error(`❌ Error updating metadata:`, error.message);
        return null;
    }
}

async function updateEmbedding(filePath, newVectors, metadata) {
    try {
        // ✅ Find existing embedding by filePath
        const embedding = await Embedding.findOne({ filePath });
        if (!embedding) {
            throw new Error("Embedding not found for file.");
        }

        // ✅ Validate vector
        if (!Array.isArray(newVectors) || newVectors.length !== VECTOR_SIZE || newVectors.some(isNaN)) {
            throw new Error("Invalid embedding vector.");
        }

        // ✅ Update vector + metadata in Qdrant
        await qdrantClient.upsert(COLLECTION_NAME, {
            points: [
                {
                    id: embedding.externalId, // Keep the same ID
                    vector: newVectors, // ✅ Overwrite vector
                    payload: { filePath, metadata }, // ✅ Overwrite metadata
                },
            ],
        });

        // ✅ Update metadata in MongoDB
        await Embedding.updateOne({ filePath }, { metadata });

        console.log(`✅ Updated embedding & metadata for file: ${filePath}`);
        return embedding;
    } catch (error) {
        console.error(`❌ Error updating embedding:`, error.message);
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
 * Search across all collections and return the most relevant results.
 * @param {number[]} queryVector - The embedding vector to search with.
 * @param {number} limit - Maximum number of results to return.
 * @param {number} threshold - Minimum similarity score to consider.
 */
async function searchAcrossCollections(queryVector, limit = 10, threshold = 0.3) {
    const collections = ["pages", "blogs", "projects", "files"];
    let allResults = [];
  
    for (const collection of collections) {
      try {
        const results = await searchQdrant(queryVector, collection, limit, threshold)
        allResults = allResults.concat(results);
      } catch (error) {
        console.warn(`Error searching ${collection}:`, error.message);
      }
    }
  
    // Sort results by highest similarity score
    allResults.sort((a, b) => b.score - a.score);
  
    // Limit final results
    return allResults.slice(0, limit);
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

async function deleteEmbedding(filePath) {
    try {
        const embedding = await Embedding.findOne({ filePath });
        if (!embedding) {
            throw new Error("Embedding not found.");
        }

        // ✅ Remove from Qdrant
        await qdrantClient.delete(COLLECTION_NAME, {
            points: [embedding.externalId],
        });

        // ✅ Remove from MongoDB
        await Embedding.deleteOne({ filePath });

        console.log(`✅ Deleted embedding for file: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error deleting embedding:`, error.message);
        return false;
    }
}


/**
 * Deletes the entire Qdrant collection.
 */
async function dropCollection(collection) {
    try {
        await qdrantClient.deleteCollection(collection);
        console.log(`✅ Dropped Qdrant collection "${collection}"`);
    } catch (error) {
        console.error(`❌ Error dropping collection: ${error.message}`);
    }
}

module.exports = {
    initCollection,
    storeEmbedding,
    updateEmbeddingMetadata,
    updateEmbedding,
    listEmbeddings,
    deleteEmbedding,
    dropCollection,
    searchAcrossCollections
};
