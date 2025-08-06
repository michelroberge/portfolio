const mongoose = require("mongoose");

const chatbotRequestLogSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true, // For fast lookup
    },
    country: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    origin: {
      type: String,
    },
    referer: {
      type: String,
    },
    host: {
      type: String,
    },
    cookies: {
      type: mongoose.Schema.Types.Mixed,
    },
    requestPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    responsePayload: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["success", "error", "blocked", "other"],
      default: "success",
    },
    error: {
      type: String,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    whitelisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("ChatbotRequestLog", chatbotRequestLogSchema);