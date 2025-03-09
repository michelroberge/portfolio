const { searchQdrant } = require("../services/qdrantService");
const { generateEmbeddings } = require("../services/embeddingService");
const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");
const mongoose = require("mongoose");
const { convertToText} = require('../utils/generatePrompt');
/**
 * Perform a hybrid search and return enriched documents
 * @param {string} query - The search query
 * @returns {Promise<{ sources: Array, context: string }>}
 */
async function performSearch(query) {
    const queryEmbedding = await generateEmbeddings(query);
    if (!queryEmbedding) throw new Error("Failed to generate query embedding.");

    // 1️⃣ Search Qdrant for relevant vector matches
    const projectResults = await searchQdrant(queryEmbedding, Project.collection.collectionName, 3);
    const blogResults = await searchQdrant(queryEmbedding, BlogEntry.collection.collectionName, 3);
    const pageResults = await searchQdrant(queryEmbedding, Page.collection.collectionName, 2);

    // 2️⃣ Fetch full MongoDB documents using vectorId
    const projects = await fetchMongoDocs(Project, projectResults);
    const blogs = await fetchMongoDocs(BlogEntry, blogResults);
    const pages = await fetchMongoDocs(Page, pageResults);

    // 3️⃣ Merge results with type labels
    const sources = [
        ...projects.map(p => ({ ...p, type: "Project" })),
        ...blogs.map(b => ({ ...b, type: "BlogEntry" })),
        ...pages.map(p => ({ ...p, type: "Page" })),
    ];

    // 4️⃣ Convert sources to structured text
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

module.exports = { performSearch };
