const WebSocket = require("ws");
const ChatMessage = require("../models/ChatMessage");
const { generatePrompt } = require("../utils/generatePrompt");
const ollamaService = require("../services/ollamaService");

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("New WebSocket connection established.");

        ws.on("message", async (message) => {
            try {
                const { sessionId, query, history, webContext } = JSON.parse(message);
                if (!sessionId || !query) {
                    ws.send(JSON.stringify({ error: "sessionId and query are required." }));
                    return;
                }

                // Generate AI prompt
                const { formattedPrompt, sources } = await generatePrompt(query, history, webContext);

                // Stream AI response
                const responseStream = await ollamaService.generateResponseStream(formattedPrompt);

                // Send streamed data
                for await (const chunk of responseStream) {
                    ws.send(JSON.stringify({ response: chunk }));
                }

                ws.send(JSON.stringify({ done: true }));

                // Store messages in database
                await ChatMessage.create({ sessionId, role: "user", text: query });
                await ChatMessage.create({ sessionId, role: "ai", text: formattedPrompt });

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
