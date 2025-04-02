// portfolio.node/src/services/chatService.js
const ChatMessage = require("../models/ChatMessage");
const cache = require("../utils/cache");
const { executePipeline } = require("../services/pipelineService");

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
        console.log(`📡 Processing chat for session: ${sessionId}`);

        // Use the AI pipeline for structured processing
        const responseData = await executePipeline("chat-response", {
            userQuery: query,
            chatHistory: JSON.stringify(history),
            context: webContext
        }, true); // Enable search

        // Store chat messages
        await ChatMessage.create({ sessionId, role: "user", text: query });
        await ChatMessage.create({ sessionId, role: "ai", text: responseData.response });

        return responseData;
    } catch (error) {
        console.error("❌ Chat processing error:", error);
        return { response: "Sorry, an error occurred.", sources: [] };
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

/**
 * Returns a random pre-generated greeting from cache.
 */
async function getRandomGreeting() {

  let greetings = cache.get("chat_greetings");
   if (!greetings){
    console.log('no greetings here');
    greetings =  ["Hello! How can I assist you today?"];
   }
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Returns the pre-generated starting context for chat.
 */
async function getChatStartingContext() {
  return cache.get("chat_context") || "This is an AI assistant for answering questions about projects and skills.";
}

module.exports = { processChat, getChatHistory, getRandomGreeting, getChatStartingContext };
