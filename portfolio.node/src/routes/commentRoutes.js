// portfolio.node/src/routes/commentRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/auth"); // Protect endpoints where necessary
const commentService = require("../services/commentService");
const router = express.Router();

/**
 * Create a new comment.
 * Expected body: { author, text, blog, parent (optional) }
 */
router.post("/", async (req, res) => {
  try {
    const { author, text, blog, parent } = req.body;
    if (!author || !text || !blog) {
      return res.status(400).json({ error: "author, text, and blog fields are required" });
    }
    const comment = await commentService.createComment({ author, text, blog, parent });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieve comments for a specific blog post (including nested replies).
 */
router.get("/blog/:blogId", async (req, res) => {
  try {
    const comments = await commentService.getCommentsByBlog(req.params.blogId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a comment by its ID.
 * Expected body may contain: { text (optional), redacted (optional) }
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text, redacted } = req.body;
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (redacted !== undefined) updateData.redacted = redacted;
    const updatedComment = await commentService.updateComment(req.params.id, updateData);
    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Redact (soft-delete) a comment by marking it as redacted.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const redactedComment = await commentService.redactComment(req.params.id);
    if (!redactedComment) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment redacted", comment: redactedComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
