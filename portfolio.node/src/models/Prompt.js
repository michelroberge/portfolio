const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Unique identifier for the prompt
    template: { type: String, required: true }, // The actual text of the prompt
    metadata: { type: Object, default: {} }, // Optional metadata (e.g., retrieval method)
    parameters: { type: [String], default: [] }, // Extracted parameters from template
  },
  { timestamps: true }
);

/**
 * Pre-save hook to extract parameters from the template.
 * Looks for `{paramName}` patterns and stores them in `parameters`.
 */
PromptSchema.pre("save", function (next) {
  const paramMatches = this.template.match(/{(.*?)}/g) || [];
  this.parameters = paramMatches.map(param => param.replace(/[{}]/g, ""));
  next();
});

module.exports = mongoose.model("Prompt", PromptSchema);
