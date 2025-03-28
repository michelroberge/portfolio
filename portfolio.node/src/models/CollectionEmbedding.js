const mongoose = require("mongoose");

const CollectionEmbeddingSchema = new mongoose.Schema({
  collectionName: { type: String, required: true }, 
  count: { type: String }, 
  lastUpdated: { type: Date },
  model: { type: String }, 
});

module.exports = mongoose.model("CollectionEmbedding", CollectionEmbeddingSchema);
