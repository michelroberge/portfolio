// portfolio.node/src/models/ProviderConfig.js
const mongoose = require("mongoose");

const ProviderConfigSchema = new mongoose.Schema({
  provider: { type: String, required: true, unique: true },
  embeddingModel : { type: String, required: true, default: "mistral:7b"},
  chatModel: { type: String, required: true, default: "mistral:7b"},
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  callbackURL: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("ProviderConfig", ProviderConfigSchema);
