const mongoose = require("mongoose");
const counterService = require("../services/counterService");

const EmbeddingSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    metadata: { type: Object, default: {} },
    externalId: { type: Number, required: true},
    vectorId : {type: Number, unique: true },

}, { timestamps: true });

EmbeddingSchema.pre('save', async function(next) {
  this.vectorId = this.vectorId || await counterService.getNextVectorId("embedding_vectorid");
  next();
});

module.exports = mongoose.model("Embedding", EmbeddingSchema);
