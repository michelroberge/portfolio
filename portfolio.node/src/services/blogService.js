// portfolio.node/src/services/blogService.js
const BlogEntry = require("../models/BlogEntry");
const counterService = require("../services/counterService");

const { addToCache, clearCache } = require("../cache");

/**
 * Creates a new blog entry and adds it to the cache.
 * @param {Object} data - Blog entry data.
 * @returns {Promise<Object>} - The saved blog entry.
 */
async function createBlogEntry(data) {
  try{
    const newEntry = new BlogEntry(data);
    await newEntry.save();
    addToCache("blogs", newEntry);
    return newEntry;
  }
  catch (err){
    console.error(err);
  }
}

/**
 * Retrieves all blog entries sorted by creation date.
 * @returns {Promise<Array>} - Array of blog entries.
 */
async function getAllBlogEntries(filter = {}) {
  const blogs = await BlogEntry.find(filter).sort({ createdAt: -1 });
  return blogs;
}

/**
 * Retrieves a single blog entry by its ID.
 * @param {string} id - The blog entry ID.
 * @returns {Promise<Object|null>} - The found blog entry or null.
 */
async function getBlogEntryById(id) {
  const blog = await BlogEntry.findById(id);
  return blog;
}

/**
 * Updates a blog entry by its ID.
 * @param {string} id - The blog entry ID.
 * @param {Object} data - Data to update.
 * @returns {Promise<Object|null>} - The updated blog entry or null.
 */
async function updateBlogEntry(id, data) {
  const updatedEntry = await BlogEntry.findByIdAndUpdate(id, data, { new: true });
  updatedEntry.save();
  return updatedEntry;
}

/**
 * Deletes a blog entry by its ID and clears the related cache.
 * @param {string} id - The blog entry ID.
 * @returns {Promise<Object|null>} - The deleted blog entry or null.
 */
async function deleteBlogEntry(id) {
  const deletedEntry = await BlogEntry.findByIdAndDelete(id);
  clearCache("blogs");
  return deletedEntry;
}

module.exports = {
  createBlogEntry,
  getAllBlogEntries,
  getBlogEntryById,
  updateBlogEntry,
  deleteBlogEntry,
};
