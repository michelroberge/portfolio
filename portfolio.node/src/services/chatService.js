// portfolio.node/src/services/chatService.js
const ChatMessage = require("../models/ChatMessage");
const {searchQdrant, generateEmbedding} = require("../services/qdrantService");
const providerConfigService = require("../services/providerConfigService");
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

      const config = await providerConfigService.getAIConfig();
      let response;
      
      if (config.provider === "ollama") {
        response = await ollamaService.generateResponse(formattedPrompt);
      } else if (config.provider === "openai") {
        response = await requestOpenAIResponse(formattedPrompt, history, config.clientId, config.clientSecret);
      } else {
        throw new Error("Invalid AI provider configured");
      }

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

async function requestOpenAIResponse(query, history, clientId, clientSecret) {
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "OpenAI-Organization": clientId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: history.concat([{ role: "user", content: query }]),
      temperature: 0.7,
    }),
  });

  return response.data.choices[0].message.content;
}
module.exports = { processChat, getChatHistory };
