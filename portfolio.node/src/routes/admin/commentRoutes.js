// portfolio.node/src/routes/commentRoutes.js
const express = require("express");
const commentService = require("../../services/commentService");
const Comment = require("../../models/Comment");
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
    // Validate parent existence if provided.
    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return res.status(400).json({ error: "Parent comment not found" });
      }
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
router.get("/:id", async (req, res) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if ( comment){
      res.json(comment);
    }else{
      res.status(404).json({message: `Comment ${id} does not exist`});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a comment by its ID.
 * Expected body may contain: { text (optional), redacted (optional) }
 */
router.put("/:id",  async (req, res) => {
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
router.delete("/:id",  async (req, res) => {
  const updatedComment = await commentService.redactComment(req.params.id);
  if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
  res.json({ message: "Comment redacted", comment: updatedComment });
});


router.get("/",  async (req, res) => {
  try {
    console.log(`calling get all comments`);
    const comments = await commentService.getAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
