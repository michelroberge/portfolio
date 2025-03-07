const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-friendly identifier
    content: { type: String, required: true }, // Markdown content
    tags: { type: [String], default: [] }, // Tags for categorization
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
