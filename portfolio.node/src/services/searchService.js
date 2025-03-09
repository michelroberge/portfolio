const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");
const { searchQdrant } = require("../services/qdrantService");
const { generateEmbeddings } = require("../services/embeddingService");
const { convertToText } = require('../utils/generatePrompt');
const { queryLLM } = require("./llmService");
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
    const queryEmbedding = await generateEmbeddings(query);
    if (!queryEmbedding) throw new Error("Failed to generate query embedding.");

    // Define available collections
    const collectionMappings = {
        "projects": { model: Project, collectionName: Project.collection.collectionName, limit: 3 },
        "blogs": { model: BlogEntry, collectionName: BlogEntry.collection.collectionName, limit: 3 },
        "pages": { model: Page, collectionName: Page.collection.collectionName, limit: 2 },
    };

    const availableCollections = Object.keys(collectionMappings);

    // 1️⃣ Use LLM to determine most relevant collections
    const sortedCollections = await sortCollectionsByRelevance(query, availableCollections);

    // 2️⃣ Search Qdrant for relevant vector matches in order of LLM's ranking
    const searchResults = {};
    for (const collection of sortedCollections) {
        const { model, collectionName, limit } = collectionMappings[collection];
        searchResults[collection] = await searchQdrant(queryEmbedding, collectionName, limit);
    }

    // 3️⃣ Fetch full MongoDB documents using vectorId
    const projects = await fetchMongoDocs(Project, searchResults["projects"] || []);
    const blogs = await fetchMongoDocs(BlogEntry, searchResults["blogs"] || []);
    const pages = await fetchMongoDocs(Page, searchResults["pages"] || []);

    // 4️⃣ Merge results with type labels
    const sources = [
        ...projects.map(p => ({ ...p, type: "Project" })),
        ...blogs.map(b => ({ ...b, type: "BlogEntry" })),
        ...pages.map(p => ({ ...p, type: "Page" })),
    ];

    // 5️⃣ Convert sources to structured text
    const context = sources.map(convertToText).join("\n\n");

    return { sources, context };
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
    // Get schema definitions from cache or DB
    const schemaDefinitions = {
        projects: extractSchema("projects", Project),
        blogs: extractSchema("blogs", BlogEntry),
        pages: extractSchema("pages", Page),
    };

    // Query LLM with schema details
    const response = await queryLLM(
        "AI Search Assistant",
        `Given the user query: "${userQuery}", rank these collections by relevance based on the following schema definitions. Each collection contains documents with the specified fields and types. Consider this when ranking the collections.`,
        { availableCollections, schemaDefinitions }
    );

    return response?.sorted_collections || availableCollections; // Fallback to default order
}

module.exports = { performSearch };
