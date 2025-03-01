// portfolio.node/src/services/chatService.js
const ChatMessage = require("../models/ChatMessage");
const {searchQdrant, generateEmbedding} = require("../services/qdrantService");
const ollamaService = require("../services/ollamaService"); // AI Model Integration
const generatePrompt = require("../utils/generatePrompt");

/**
 * Processes a user query using the AI model.
 * @param {string} sessionId - Chat session ID.
 * @param {string} query - User's chat message.
 * @param {array} history - Previous chat messages.
 * @param {string} webContext - Extracted web page content (if available).
 * @returns {Promise<{ response: string, sources: string[] }>} - AI response with sources.
 */
async function processChat(sessionId, query, history = [], webContext = "") {
  try {
      // Generate AI prompt
      const { formattedPrompt, sources } = await generatePrompt(query, history, webContext);

      // Send to AI model
      const response = await ollamaService.generateResponse(formattedPrompt);

      // Store user message & AI response in chat history
      await ChatMessage.create({ sessionId, role: "user", text: query });
      await ChatMessage.create({ sessionId, role: "ai", text: response });

      return { response, sources };
  } catch (error) {
      console.error(`❌ Chat processing error:`, error.message);
      return { response: "Sorry, I encountered an error.", sources: [] };
  }
}



/**
 * Retrieves chat history for a session.
 * @param {string} sessionId - The chat session identifier.
 * @returns {Promise<ChatMessage[]>} - Chat history messages.
 */
async function getChatHistory(sessionId) {
  return await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
}

module.exports = { processChat, getChatHistory };
