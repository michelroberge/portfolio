// portfolio.node/src/services/commentService.js
const Comment = require("../models/Comment");

async function getAllComments() {
  const comments = await Comment.find({ parent: null }).sort({ createdAt: -1 });
  return Promise.all(
    comments.map(async (comment) => {
      const nestedReplies = await getNestedReplies(comment._id, comment.redacted);
      return { ...comment.toObject(), replies: nestedReplies };
    })
  );
}

async function getNestedReplies(parentId, redacted) {
  const replies = await Comment.find({ parent: parentId, redacted: redacted }).sort({ createdAt: 1 });
  return Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await getNestedReplies(reply._id);
      return { ...reply.toObject(), replies: nestedReplies };
    })
  );
}

/**
 * Retrieves root-level comments for a given blog post along with their immediate replies.
 * @param {string} blogId - The blog post ID.
 * @returns {Promise<Array>} - Array of comments with nested replies.
 */
async function getCommentsByBlog(blogId) {
  const comments = await Comment.find({ blog: blogId, parent: null }).sort({ createdAt: -1 });
  return Promise.all(
    comments.map(async (comment) => {
      const nestedReplies = await getNestedReplies(comment._id, false);
      return { ...comment.toObject(), replies: nestedReplies };
    })
  );
}


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
  getAllComments
};
