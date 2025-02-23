// portfolio.node/src/services/commentService.js
const Comment = require("../models/Comment");

/**
 * Creates a new comment.
 * @param {Object} data - Comment data: { author, text, blog, parent (optional) }
 * @returns {Promise<Object>} - The created comment.
 */
async function createComment(data) {
  const { author, text, blog, parent } = data;
  const comment = new Comment({
    author,
    text,
    blog,
    parent: parent || null,
  });
  await comment.save();
  return comment;
}

/**
 * Retrieves root-level comments for a given blog post along with their immediate replies.
 * @param {string} blogId - The blog post ID.
 * @returns {Promise<Array>} - Array of comments with nested replies.
 */
async function getCommentsByBlog(blogId) {
  const comments = await Comment.find({ blog: blogId, parent: null }).sort({ createdAt: -1 });
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({ parent: comment._id }).sort({ createdAt: 1 });
      return { ...comment.toObject(), replies };
    })
  );
  return commentsWithReplies;
}

/**
 * Updates a comment by its ID.
 * @param {string} id - Comment ID.
 * @param {Object} updateData - Data to update (text, redacted).
 * @returns {Promise<Object|null>} - The updated comment or null if not found.
 */
async function updateComment(id, updateData) {
  return Comment.findByIdAndUpdate(id, updateData, { new: true });
}

/**
 * Redacts a comment by its ID (marks as redacted).
 * @param {string} id - Comment ID.
 * @returns {Promise<Object|null>} - The redacted comment or null if not found.
 */
async function redactComment(id) {
  return Comment.findByIdAndUpdate(id, { redacted: true }, { new: true });
}

module.exports = {
  createComment,
  getCommentsByBlog,
  updateComment,
  redactComment,
};
