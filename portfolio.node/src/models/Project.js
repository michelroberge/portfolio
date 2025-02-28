// portfolio.node/src/models/Project.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  isDraft: { type: Boolean, default: false },
  publishAt: { type: Date, default: Date.now },
  tags: { type: [String], default: [] }, 
  industry: { type: String, default: "General" }, 
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
