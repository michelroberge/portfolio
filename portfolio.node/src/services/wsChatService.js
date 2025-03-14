const WebSocket = require("ws");
const { executePipeline } = require("../services/pipelineService");
const { generateResponseStream } = require("../services/ollamaService");

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

                console.log(`📡 WebSocket received query: "${query}"`);

                // Send pipeline updates step-by-step
                const streamCallback = (update) => {
                    ws.send(JSON.stringify(update));
                };

                // Execute pipeline with streaming enabled
                const responseData = await executePipeline("chat-response", {
                    userQuery: query,
                    chatHistory: JSON.stringify(history),
                }, true, streamCallback);

                // Stream the final AI response from Ollama
                const responseStream = await generateResponseStream(responseData.response);
                const reader = responseStream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        ws.send(JSON.stringify({ done: true }));
                        break;
                    }

                    // Enqueue the streamed JSON chunk
                    ws.send(JSON.stringify({ response: value.trim() }));
                }
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
