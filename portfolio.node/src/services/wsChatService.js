// portfolio.node/src/services/wsChatService.js
const WebSocket = require("ws");
const ChatMessage = require("../models/ChatMessage");
const {generateEmbedding, searchQdrant} = require("../services/qdrantService");
const ollamaService = require("../services/ollamaService");

const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", async (message) => {
      try {
        const { sessionId, query } = JSON.parse(message);
        if (!sessionId || !query) {
          ws.send(JSON.stringify({ error: "sessionId and query are required." }));
          return;
        }

        // Store user message in DB
        await ChatMessage.create({ sessionId, role: "user", text: query });


        const vectors = await generateEmbedding(query);
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
        ${query}
        
        ### AI Response:
        `.trim();

        // Stream AI response
        const responseStream = await ollamaService.generateResponseStream(structuredPrompt);

        // Send streamed data
        for await (const chunk of responseStream) {
          ws.send(JSON.stringify({ response: chunk }));
        }

        ws.send(JSON.stringify({ done: true }));

      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({ error: "An error occurred while processing your request." }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  });

  return wss;
};

module.exports = { setupWebSocketServer };
