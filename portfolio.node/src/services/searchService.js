const { generateEmbeddings } = require("./embeddingService");
const { searchQdrant } = require("./qdrantService");

/**
 * Perform a hybrid search on any entity by dynamically determining its collection name.
 * @param {Object} model - Mongoose model (e.g., Project, BlogEntry)
 * @param {string} query - User's search query
 * @param {number} [limit=10] - Maximum number of results
 * @param {number} [minScore=0.5] - Minimum similarity score for vector search
 * @returns {Promise<Array>} - Combined search results
 */
async function searchEntitiesHybrid(model, query, limit = 10, minScore = 0.5) {
    if (!query || query.trim().length === 0) throw new Error("Query is required for search.");
    if (!model || !model.collection) throw new Error("Invalid model provided for search.");

    const collectionName = model.collection.collectionName;
    console.log(`🔍 Performing hybrid search for "${query}" in collection: ${collectionName}`);

    // 1️⃣ Generate query embedding
    const queryEmbedding = await generateEmbeddings(query);
    if (!queryEmbedding) throw new Error("Failed to generate query embedding.");

    // 2️⃣ Perform vector search in Qdrant
    const vectorResults = await searchQdrant(queryEmbedding, collectionName, limit, minScore);

    // 3️⃣ Perform full-text search in MongoDB
    const textResults = await searchEntitiesText(model, query, limit);

    // 4️⃣ Merge results (prioritizing vector search)
    return mergeSearchResults(vectorResults, textResults, limit);
}

/**
 * Perform a full-text search using MongoDB's text index.
 * @param {Object} model - Mongoose model (e.g., Project, BlogEntry)
 * @param {string} query - Search query
 * @param {number} [limit=10] - Maximum number of results
 * @returns {Promise<Array>} - List of matching documents
 */
async function searchEntitiesText(model, query, limit = 10) {
    try {

        // disabled for now
        return [];
        return await model.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch (error) {
        console.error(`❌ Error in full-text search (${model.modelName}):`, error.message);
        return [];
    }
}

/**
 * Merge search results from Qdrant and MongoDB, ensuring diversity.
 * @param {Array} vectorResults - Results from Qdrant
 * @param {Array} textResults - Results from MongoDB
 * @param {number} limit - Maximum number of results
 * @returns {Array} - Combined results with minimal duplication
 */
function mergeSearchResults(vectorResults, textResults, limit) {
    const resultMap = new Map();

    // Prioritize vector results
    for (const item of vectorResults) {
        resultMap.set(item.id, { ...item.metadata, score: item.score, source: "vector" });
    }

    // Add full-text results (if not already included)
    for (const item of textResults) {
        if (!resultMap.has(item._id.toString())) {
            resultMap.set(item._id.toString(), { ...item, score: 1.0, source: "text" });
        }
    }

    // Convert to array, sort by highest score, and limit results
    return Array.from(resultMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

module.exports = { searchEntitiesHybrid, searchEntitiesText };
