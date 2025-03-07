const mongoose = require("mongoose");
const counterService = require("../services/counterService");

const BlogEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  // Blog body stored in Markdown format.
  body: { type: String, required: true },
  isDraft: { type: Boolean, default: false },
  publishAt: { type: Date },
  vectorId : {type: Number, unique: true },
  link : {type : String, default: null},
  tags: {type: Array, default: []}

}, { timestamps: true });

// Generate slug and link from title.
BlogEntrySchema.pre('save', async function(next) {
  const slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters.
    .replace(/\s+/g, '-')     // Replace spaces with hyphens.
    .replace(/-+/g, '-');     // Collapse multiple hyphens.
  
  this.link = this.link || `${slug}-${this._id}`;
  this.vectorId = this.vectorId || await counterService.getNextVectorId();
  next();
});

module.exports = mongoose.model("BlogEntry", BlogEntrySchema);
