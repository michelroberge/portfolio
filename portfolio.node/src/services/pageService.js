const Page = require("../models/Page");
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding, deleteEmbedding, initCollection } = require("./qdrantService");
const { searchEntitiesHybrid } = require("./searchService");

/**
 * Create a new page and store its embedding.
 * @param {Object} data - Page data
 * @returns {Promise<Object>} Created page
 */
async function createPage(data) {
    const page = new Page(data);
    await page.save();

    // Generate and store embeddings
    await updatePageEmbeddings(page);

    return page;
}

/**
 * Update an existing page and optionally refresh embeddings.
 * @param {string} id - Page ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated page
 */
async function updatePage(id, updates) {
    const page = await Page.findByIdAndUpdate(id, updates, { new: true });
    if (!page) return null;

    // If content/title changes, regenerate embeddings
    if (updates.title || updates.content) {
        await updatePageEmbeddings(page);
    }

    return page;
}

/**
 * Delete a page and remove its embedding from Qdrant.
 * @param {string} id - Page ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function deletePage(id) {
    const page = await Page.findByIdAndDelete(id);
    if (!page) return false;

    await deleteEmbedding("pages", page.vectorId);
    return true;
}

/**
 * Retrieve a single page by ID.
 * @param {string} id - Page ID
 * @returns {Promise<Object|null>} Page object
 */
async function getPageById(id) {
    return Page.findById(id);
}

/**
 * Retrieve a single page by slug.
 * @param {string} slug - Page slug
 * @returns {Promise<Object|null>} Page object
 */
async function getPageBySlug(slug) {
    return Page.findOne({ slug });
}

/**
 * Retrieve all pages with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Array>} List of pages
 */
async function getAllPages(filter = {}) {
    return Page.find(filter);
}

/**
 * Generate embeddings for a single page and store them in Qdrant.
 * @param {Object} page - Page object
 */
async function updatePageEmbeddings(page) {
    const text = `${page.title} ${page.content}`;

    const embedding = await generateEmbeddings(text);
    if (!embedding) throw new Error(`Failed to generate embedding for page: ${page._id}`);

    await storeEmbedding(Page.collection.collectionName, page.vectorId, embedding, {
        title: page.title,
        tags: page.tags || [],
    });
}

/**
 * Refresh all or only changed page embeddings.
 * @param {boolean} fullRefresh - If true, refresh all embeddings; otherwise, only update modified pages.
 */
async function refreshPageEmbeddings(fullRefresh = false) {
    const filter = fullRefresh ? {} : { updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }; // Last 24h updates
    const pages = await getAllPages(filter);

    for (const page of pages) {
        await updatePageEmbeddings(page);
    }

    return { message: `Refreshed ${pages.length} page embeddings.` };
}

/**
 * Search pages using semantic vector search.
 * @param {string} query - User's search query
 * @returns {Promise<Array>} List of matching pages
 */
async function searchPages(query) {
    return searchEntitiesHybrid(Page, query);
}

/**
 * Initializes embeddings for the Page model.
 */
async function initializePageEmbeddings() {
    const collectionName = Page.collection.collectionName; // Use MongoDB model's collection name
    console.log(`🔄 Initializing embeddings for "${collectionName}"...`);

    // 1️⃣ Ensure Qdrant collection exists
    await initCollection(collectionName);

    // 2️⃣ Fetch all documents from MongoDB
    const documents = await Page.find({});
    if (!documents.length) {
        console.log(`⚠️ No documents found in "${collectionName}", skipping.`);
        return;
    }

    // 3️⃣ Generate & Store Embeddings
    for (const doc of documents) {

        if ( !doc.vectorId){
            // trigger vector generation
            await doc.save();
        }

        const text = `${doc.title} ${doc.content || ""}`;
        if (!text.trim()) continue;

        const embedding = await generateEmbeddings(text);
        if (!embedding) {
            console.error(`❌ Failed to generate embedding for ${collectionName}: ${doc._id}`);
            continue;
        }

        await storeEmbedding(collectionName, doc.vectorId, embedding, {
            title: doc.title,
            tags: doc.tags || [],
        });

        console.log(`✅ Stored embedding for "${collectionName}" -> ${doc.title}`);
    }
}

module.exports = {
    createPage,
    updatePage,
    deletePage,
    getPageById,
    getPageBySlug,
    getAllPages,
    updatePageEmbeddings,
    refreshPageEmbeddings,
    searchPages,
    initializePageEmbeddings
};
