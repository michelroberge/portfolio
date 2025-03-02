// portfolio.node/src/models/ProviderConfig.js
const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  Value: { type: Number, required: true},
  Name: {type: String},

}, { timestamps: true });

module.exports = mongoose.model("Counter", CounterSchema);
