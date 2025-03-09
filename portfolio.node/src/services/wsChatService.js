const WebSocket = require("ws");
const ChatMessage = require("../models/ChatMessage");
const { generatePrompt } = require("../utils/generatePrompt");
const { searchEntitiesHybrid } = require("../services/searchService");
const ollamaService = require("../services/ollamaService");
const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");

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

                // 1️⃣ Send an immediate pre-search response
                ws.send(JSON.stringify({ response: "⏳ Stay tuned! I'm searching for relevant information..." }));

                // 2️⃣ Perform Hybrid Search Across All Relevant Entities
                ws.send(JSON.stringify({ response: "⏳ Stay tuned! I'm searching for relevant information..." }));
                const projectResults = await searchEntitiesHybrid(Project, query, 3);
                const blogResults = await searchEntitiesHybrid(BlogEntry, query, 3);
                const pageResults = await searchEntitiesHybrid(Page, query, 2);

                // Combine results and extract relevant context
                const sources = [...projectResults, ...blogResults, ...pageResults];
                const context = sources.map(src => `${src.title}: ${src.content || src.description}`).join("\n\n");

                console.log(`🔎 Search complete - Found ${sources.length} relevant documents.`);

                // 3️⃣ Inform the user that the AI is generating a response
                ws.send(JSON.stringify({ response: "✨ Found some useful information! Now generating a response..." }));

                // 4️⃣ Generate AI prompt
                const { formattedPrompt } = await generatePrompt(query, history, context);

                console.log(`💬 Sending AI query: ${formattedPrompt}`);

                // 5️⃣ Stream AI response
                const responseStream = await ollamaService.generateResponseStream(formattedPrompt);

                // Send streamed data in chunks
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
