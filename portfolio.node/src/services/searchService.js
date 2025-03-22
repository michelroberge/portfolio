const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");
const { queryLLMByName } = require("./llmService");
const { executePipeline } = require("../services/pipelineService");
const cache = require("../utils/cache");

/**
 * Extracts schema definitions from a Mongoose model with caching.
 * @param {string} modelName - The collection name.
 * @param {object} model - The Mongoose model.
 * @returns {object} - A schema definition object with field names and types.
 */
function extractSchema(modelName, model) {
    const cacheKey = `schema_${modelName}`;
    let schema = cache.get(cacheKey);

    if (!schema) {
        schema = {};
        Object.entries(model.schema.paths).forEach(([key, value]) => {
            schema[key] = value.instance; // Extract field type (String, Number, etc.)
        });

        cache.set(cacheKey, schema); // Store schema in cache
    }

    return schema;
}


/**
 * Perform a hybrid search and return enriched documents
 * @param {string} query - The search query
 * @returns {Promise<{ sources: Array, context: string }>}
 */
async function performSearch(query) {
    console.log(`🔍 Executing AI-powered search for query: "${query}"`);

    // Use pipeline for structured search
    const response = await executePipeline("search-intent", { userQuery: query }, true);

    return { sources: response.sources, context: response.response };
}

/**
 * Fetches full MongoDB documents for search results from Qdrant
 */
async function fetchMongoDocs(model, qdrantResults) {
    const vectorIds = qdrantResults.map(doc => doc.id);
    if (vectorIds.length === 0) return [];

    const documents = await model.find({ vectorId: { $in: vectorIds } }).lean();
    return documents.map(doc => {
        const qdrantMatch = qdrantResults.find(q => q.id === doc.vectorId);
        return { ...doc, score: qdrantMatch?.score || 0 };
    });
}

/**
 * Determines the most relevant collections to query for a given user prompt.
 * @param {string} userQuery - The search query.
 * @param {string[]} availableCollections - List of available collections.
 * @returns {Promise<string[]>} - The collections sorted by relevance.
 */
async function sortCollectionsByRelevance(userQuery, availableCollections) {
    const response = await queryLLMByName("search-intent", {
        userQuery,
        availableCollections: JSON.stringify(availableCollections)
    });

    return response?.sorted_collections || availableCollections; // Fallback to default order
}



module.exports = { performSearch, sortCollectionsByRelevance };
