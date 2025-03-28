const BlogEntry = require("../models/BlogEntry");
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding, deleteEmbedding, initCollection } = require("./qdrantService");
const { searchEntitiesHybrid } = require("./searchService");

/**
 * Create a new blog post and store its embedding.
 * @param {Object} data - Blog data
 * @returns {Promise<Object>} Created blog entry
 */
async function createBlog(data) {
    const blog = new BlogEntry(data);
    await blog.save();
    // Generate and store embeddings
    await updateBlogEmbeddings(blog);

    return blog;
}

/**
 * Update an existing blog post and optionally refresh embeddings.
 * @param {string} id - Blog ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated blog
 */
async function updateBlog(id, updates) {
    const blog = await BlogEntry.findByIdAndUpdate(id, updates, { new: true });
    if (!blog) return null;

    // If content/title changes, regenerate embeddings
    if (updates.title || updates.content) {
        await updateBlogEmbeddings(blog);
    }

    return blog;
}

/**
 * Delete a blog post and remove its embedding from Qdrant.
 * @param {string} id - Blog ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function deleteBlog(id) {
    const blog = await BlogEntry.findByIdAndDelete(id);
    if (!blog) return false;

    await deleteEmbedding("blogs", id);
    return true;
}

/**
 * Retrieve a single blog post by ID.
 * @param {string} id - Blog ID
 * @returns {Promise<Object|null>} Blog object
 */
async function getBlogById(id) {
    return BlogEntry.findById(id);
}

/**
 * Retrieve all blog posts with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Array>} List of blogs
 */
async function getAllBlogs(filter = {}) {
    return BlogEntry.find(filter);
}

/**
 * generic find with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Object>} List of blogs
 */
async function findOne(filter = {}) {
    return BlogEntry.findOne(filter);
}

/**
 * generic find with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Array>} List of blogs
 */
async function find(filter = {}) {
    return BlogEntry.find(filter);
}

/**
 * Generate embeddings for a single blog post and store them in Qdrant.
 * @param {Object} blog - Blog object
 */
async function updateBlogEmbeddings(blog) {
    const text = `${blog.title} ${blog.content}`;

    const embedding = await generateEmbeddings(text);
    if (!embedding) throw new Error(`Failed to generate embedding for blog: ${blog._id}`);

    await storeEmbedding(BlogEntry.collection.collectionName, blog.vectorId, embedding, {
        title: blog.title,
        tags: blog.tags || [],
        author: blog.author || "",
    });
}

/**
 * Refresh all or only changed blog embeddings.
 * @param {boolean} fullRefresh - If true, refresh all embeddings; otherwise, only update modified blogs.
 */
async function refreshBlogEmbeddings(fullRefresh = false) {
    const filter = fullRefresh ? {} : { updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }; // Last 24h updates
    const blogs = await getAllBlogs(filter);

    for (const blog of blogs) {
        await updateBlogEmbeddings(blog);
    }

    return { message: `Refreshed ${blogs.length} blog embeddings.` };
}

/**
 * Search blogs using semantic vector search.
 * @param {string} query - User's search query
 * @returns {Promise<Array>} List of matching blogs
 */
async function searchBlogs(query) {
    return searchEntitiesHybrid(BlogEntry, query);
}

/**
 * Initializes embeddings for the BlogEntry model.
 */
async function initializeBlogEmbeddings() {
    const collectionName = BlogEntry.collection.collectionName; // Use MongoDB model's collection name
    console.log(`🔄 Initializing embeddings for "${collectionName}"...`);

    // 1️⃣ Ensure Qdrant collection exists
    await initCollection(collectionName);

    // 2️⃣ Fetch all documents from MongoDB
    const documents = await BlogEntry.find({});
    if (!documents.length) {
        console.log(`⚠️ No documents found in "${collectionName}", skipping.`);
        return;
    }

    // 3️⃣ Generate & Store Embeddings
    for (const doc of documents) {
        const text = `${doc.title} ${doc.content || ""}`;
        if (!text.trim()) continue;

        if ( !doc.vectorId){
            await doc.save();
        }
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

async function getSearchResultByVectorId(filter) {
  const blog = await findOne(filter);
  return {
    _id: blog._id,
    title: blog.title,
    link: `/blogs/${blog.link}`,
    excerpt: blog.excerpt,
    type: 'blog',
  };
}


module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getAllBlogs,
    updateBlogEmbeddings,
    refreshBlogEmbeddings,
    searchBlogs,
    initializeBlogEmbeddings,
    find,
    findOne,
    getSearchResultByVectorId,
};
