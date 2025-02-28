// portfolio.node/src/services/chatService.js
const ChatMessage = require("../models/ChatMessage");
const {searchQdrant, generateEmbedding} = require("../services/qdrantService");
const ollamaService = require("../services/ollamaService"); // AI Model Integration

/**
 * Stores user messages and AI responses in the chat history.
 * @param {string} sessionId - The chat session identifier.
 * @param {string} userQuery - The user's input message.
 * @returns {Promise<{ response: string, sources: string[] }>} - AI response with sources.
 */
async function processChatMessage(sessionId, userQuery) {
  // Store user message
  await ChatMessage.create({ sessionId, role: "user", text: userQuery });

  // Retrieve relevant knowledge from Qdrant
  const vectors = await generateEmbedding(userQuery);
  const relatedDocs = await searchQdrant(vectors, "projects");

  // Structure a prompt for AI based on retrieved context
  const context = relatedDocs.map((doc) => doc.payload.text).join("\n");
  const structuredPrompt = `
  You are an AI assistant helping showcase my portfolio. You ONLY use the provided context to answer questions.
  If a question is about my projects, focus specifically on projects in the provided context.
  If the question is unrelated to my work, say "I'm here to discuss my portfolio. Ask me about my projects or skills!"
  
  ### Context:
  ${context || "No relevant projects found in the database."}
  
  ### User Question:
  ${userQuery}
  
  ### AI Response:
  `.trim();
  // Get AI response
  const aiResponse = await ollamaService.generateResponse(structuredPrompt);

  // Store AI response
  await ChatMessage.create({ sessionId, role: "ai", text: aiResponse.response });

  return { response: aiResponse.response, sources: relatedDocs.map((doc) => doc.source) };
}

/**
 * Retrieves chat history for a session.
 * @param {string} sessionId - The chat session identifier.
 * @returns {Promise<ChatMessage[]>} - Chat history messages.
 */
async function getChatHistory(sessionId) {
  return await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
}

module.exports = { processChatMessage, getChatHistory };
