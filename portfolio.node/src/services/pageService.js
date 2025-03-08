const Page = require("../models/Page");

/**
 * Fetch all pages
 */
async function getAllPages() {
  return await Page.find({});
}

/**
 * Fetch a single page by slug
 */
async function getPageBySlug(slug) {
  return await Page.findOne({ slug });
}

/**
 * Create a new page
 */
async function createPage(data) {
  const page = new Page(data);
  return await page.save();
}

/**
 * Update an existing page
 */
async function updatePage(id, data) {
  return await Page.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Delete a page
 */
async function deletePage(id) {
  return await Page.findByIdAndDelete(id);
}

module.exports = {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
};
