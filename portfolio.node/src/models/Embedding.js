const mongoose = require("mongoose");

const EmbeddingSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("Embedding", EmbeddingSchema);
