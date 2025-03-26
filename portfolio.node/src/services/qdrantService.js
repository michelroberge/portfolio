const { QdrantClient } = require("@qdrant/js-client-rest");
const QDRANT_URL = process.env.QDRANT_URL || "http://10.0.0.42:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const EMBEDDING_SERVICE = process.env.EMBEDDING_SERVICE?.toLowerCase() || "ollama"; // Default to Ollama
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || (EMBEDDING_SERVICE === "openai" ? 1536 : 4096);

const qdrantClient = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
});

/**
 * Initialize a Qdrant collection if it does not exist.
 * @param {string} collection - Collection name
 */
async function initCollection(collection) {
    try {
        console.log(`🗑️ Dropping existing Qdrant collection: "${collection}"...`);
        await qdrantClient.deleteCollection(collection); // ✅ Drop collection before reinitialization
        console.log(`✅ Collection "${collection}" dropped successfully.`);
    } catch (error) {
        console.log(`⚠️ Collection "${collection}" did not exist, proceeding with initialization.`);
    }

    await ensureCollection(collection);
}

async function ensureCollection(collection){
    try {
        console.log(`📌 Creating new Qdrant collection: "${collection}"...`);
        await qdrantClient.createCollection(collection, {
            vectors: { size: VECTOR_SIZE, distance: "Cosine" },
        });
        console.log(`✅ Collection "${collection}" created.`);
    } catch (error) {
        console.error(`! Cannot create collection "${collection}":`, error.message);
    }
}

/**
 * Store an embedding in Qdrant.
 * @param {string} collection - Collection name
 * @param {string} id - Unique document ID
 * @param {number[]} vectors - Embedding vector
 * @param {object} metadata - Metadata associated with the document
 */
async function storeEmbedding(collection, id, vectors, metadata = {}) {

    if (!Array.isArray(vectors) || vectors.length !== VECTOR_SIZE) {
        throw new Error(`❌ Invalid embedding vector: expected ${VECTOR_SIZE} dimensions.`);
    }

    await ensureCollection(collection);

    console.log(`Storing embedding in Qdrant collection: "${collection}" with id: ${id}`, metadata  );
    try {
        await qdrantClient.upsert(collection, {
            points: [
                {
                    id,
                    vectors,
                    payload: metadata,
                },
            ],
        });
    } catch (error) {
        console.error(`❌ Error storing embedding in Qdrant:`, error.message);
    }
}

/**
 * Perform a semantic search in Qdrant.
 * @param {number[]} queryVector - The query embedding vector
 * @param {string} collection - Collection name
 * @param {number} [limit=5] - Max number of results
 * @param {number} [minScore=0.5] - Minimum similarity score
 * @returns {Promise<object[]>} - List of matching documents
 */
async function searchQdrant(queryVector, collection, limit = 5, minScore = 0.3) {
    try {

        if ( !queryVector || queryVector.length != VECTOR_SIZE){
            console.error("invalid vector received in searchQdrant");
            return [];
        }
        console.log(`📡 Searching Qdrant in collection "${collection}"...`);
        // console.log(`collection: ${collection}`);
        // console.log(`vector count: ${queryVector.length}`);
        // console.log(`limit: ${limit}`);
        // console.log(`min score: ${minScore}`);

        const response = await qdrantClient.search(collection, {
            vector: queryVector,
            limit,
            with_payload: true,
            score_threshold: minScore,
        });

        if (!response || response.length === 0) {
            console.log("⚠️ No relevant search results found.");
            return [];
        }

        return response
            .filter(doc => doc.score >= minScore)
            .sort((a, b) => b.score - a.score)
            .map(doc => ({
                id: doc.id,
                score: doc.score,
                metadata: doc.payload,
            }));
    } catch (error) {
        console.error(`❌ Qdrant Search on ${collection} Error: ${error.message}`);
        return [];
    }
}

/**
 * Delete an embedding from Qdrant.
 * @param {string} collection - Collection name
 * @param {string} id - Document ID to delete
 */
async function deleteEmbedding(collection, id) {
    try {
        await qdrantClient.delete(collection, {
            points: [id],
        });
        console.log(`✅ Deleted embedding for document ID: ${id} in collection '${collection}'`);
    } catch (error) {
        console.error(`❌ Error deleting embedding:`, error.message);
    }
}

/**
 * Drop an entire Qdrant collection.
 * @param {string} collection - Collection name
 */
async function dropCollection(collection) {
    try {
        await qdrantClient.deleteCollection(collection);
        console.log(`✅ Dropped Qdrant collection "${collection}"`);
    } catch (error) {
        console.error(`❌ Error dropping collection: ${error.message}`);
    }
}

async function getVectorsByCollectionName(collectionName) {
    try {
        let vectors = [];
        let offset = 0;
        const limit = 1000;

        while (true) {
            const scrollResponse = await qdrantClient.scroll(collectionName, {
                offset: offset,
                with_payload: false,
                with_vector: true
            });

            // Flatten the vectors extraction
            const collectionVectors = scrollResponse.points.map(point => {
                // Ensure we're getting a single-level array of numbers
                return Array.isArray(point.vector) 
                    ? (Array.isArray(point.vector[0]) 
                        ? point.vector[0]  // If nested, take first level
                        : point.vector)    // If already flat, use as-is
                    : point.vector;        // Fallback
            }).filter(vector => Array.isArray(vector)); // Ensure only array vectors

            vectors = [...vectors, ...collectionVectors];

            // Qdrant might not support limit in scroll, so check points length
            if (collectionVectors.length === 0) {
                break;
            }

            offset += collectionVectors.length;
        }
        return vectors;
    } catch (error) {
        console.error(`Error retrieving vectors for collection ${collectionName}:`, error);
        throw error;
    }
}

module.exports = {
    initCollection,
    storeEmbedding,
    searchQdrant,
    deleteEmbedding,
    dropCollection,
    getVectorsByCollectionName,
};
