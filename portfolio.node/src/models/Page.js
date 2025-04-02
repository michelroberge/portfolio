const mongoose = require("mongoose");
const counterService = require("../services/counterService");

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-friendly identifier
    content: { type: String, required: true }, // Markdown content
    tags: { type: [String], default: [] }, // Tags for categorization
    vectorId : {type: Number, unique: true },
  },
  { timestamps: true }
);

PageSchema.pre('save', async function(next) {
  this.vectorId = this.vectorId || await counterService.getNextVectorId("page_vectorid");
  next();
});

module.exports = mongoose.model("Page", PageSchema);
