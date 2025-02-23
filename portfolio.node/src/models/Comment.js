const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    // The author of the comment (could be a username or user ID)
    author: { type: String, required: true },
    // The text content of the comment
    text: { type: String, required: true },
    // Reference to the blog post this comment is associated with
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "BlogEntry", required: true },
    // For nested replies: if this comment is a reply, reference its parent comment.
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    // Flag to indicate if the comment has been redacted (i.e., moderated)
    redacted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
