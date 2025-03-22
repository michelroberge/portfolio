const mongoose = require("mongoose");
const counterService = require("../services/counterService");

const BookChapterSchema = new mongoose.Schema(
  {
    booktitle: { type: String, required: true },
    chapter: { type: String }, 
    chapterno: { type: Number }, 
    content: { type: String, required: true }, 
    tags: { type: [String], default: [] }, 
    vectorId : {type: Number, unique: true },
  },
  { timestamps: true }
);

BookChapterSchema.pre('save', async function(next) {
  this.vectorId = this.vectorId || await counterService.getNextVectorId("book_chapter_vectorid");
  next();
});

module.exports = mongoose.model("BookChapter", BookChapterSchema);
