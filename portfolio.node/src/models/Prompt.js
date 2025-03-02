const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Unique identifier for the prompt
    template: { type: String, required: true }, // The actual text of the prompt
    metadata: { type: Object, default: {} } // Optional metadata
}, { timestamps: true });

module.exports = mongoose.model("Prompt", PromptSchema);
