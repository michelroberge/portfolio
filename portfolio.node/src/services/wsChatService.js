const WebSocket = require("ws");
const ChatMessage = require("../models/ChatMessage");
const { generatePrompt } = require("../utils/generatePrompt");
const { performSearch } = require("../services/searchService");
const ollamaService = require("../services/ollamaService");

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("✅ New WebSocket connection established.");

        ws.on("message", async (message) => {
            try {
                const { sessionId, query, history } = JSON.parse(message);
                if (!sessionId || !query) {
                    ws.send(JSON.stringify({ error: "sessionId and query are required." }));
                    return;
                }

                console.log(`📡 Received query: "${query}" - Starting search`);

                // 1️⃣ Notify user that search is starting
                ws.send(JSON.stringify({ response: "⏳ Searching for relevant information..." }));

                // 2️⃣ Perform the search (Qdrant + MongoDB)
                const { sources, context } = await performSearch(query);
                console.log(`🔎 Search complete - Found ${sources.length} relevant documents.`);

                // 3️⃣ Notify user that AI is generating a response
                ws.send(JSON.stringify({ response: "✨ Found useful information! Generating a response..." }));

                // 4️⃣ Generate AI prompt
                const { formattedPrompt } = await generatePrompt(query, history, context);

                // 5️⃣ Stream AI response
                const responseStream = await ollamaService.generateResponseStream(formattedPrompt);
                for await (const chunk of responseStream) {
                    ws.send(JSON.stringify({ response: chunk }));
                }

                ws.send(JSON.stringify({ done: true }));

                // 6️⃣ Store chat messages in database
                await ChatMessage.create({ sessionId, role: "user", text: query });
                await ChatMessage.create({ sessionId, role: "ai", text: formattedPrompt });

            } catch (error) {
                console.error("❌ WebSocket error:", error);
                ws.send(JSON.stringify({ error: "An error occurred while processing your request." }));
            }
        });

        ws.on("close", () => {
            console.log("❌ WebSocket connection closed.");
        });
    });

    return wss;
};

module.exports = { setupWebSocketServer };
