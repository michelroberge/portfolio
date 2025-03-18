const WebSocket = require("ws");
const { executePipeline } = require("../services/pipelineService");
const { generateResponseStream } = require("../services/ollamaService");

const logColor = (message, colorCode = 94) => {
    console.log(`\x1b[${colorCode}m${message}\x1b[0m`);
};

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("✅ New WebSocket connection established.");

        ws.on("message", async (message) => {
            try {
                logColor("Server: received socket message", 94);
                const parsedMessage = JSON.parse(message);
                const sessionId = parsedMessage.sessionId || "default";
                const query = parsedMessage.message || parsedMessage.query; // Ensure correct field
                const history = parsedMessage.history || [];
        
                if (!query) {
                    logColor("Server: No query", 91);
                    ws.send(JSON.stringify({ error: "Query is required." }));
                    return;
                }
        
                logColor(`📡 WebSocket received query: "${query}"`, 92);
        
                // **DEBUG LOG: Ensure WebSocket can write messages**
                logColor("✅ Sending step response: Searching information...", 96);
        
                ws.send(JSON.stringify({
                    response: "Searching information...",
                    step: true
                }));
        
                // Execute pipeline with streaming enabled
                const streamCallback = (update) => {
                    logColor(`📡 Step update: ${JSON.stringify(update)}`, 94);
        
                    ws.send(JSON.stringify({
                        ...update,
                        step: true
                    }));
                };
        
                // Call pipeline function with streaming
                const responseData = await executePipeline("chat-response", {
                    userQuery: query,
                    chatHistory: JSON.stringify(history),
                }, true, streamCallback);
        
                logColor("✅ Pipeline execution completed, sending final AI response", 96);
        
                // **STREAM FINAL AI RESPONSE**
                setTimeout(async () => {
                    try {
                        const responseStream = await generateResponseStream(responseData.response);
                        const reader = responseStream.getReader();
                        let previousChunks = "";
        
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                logColor("✅ AI Response Streaming Completed", 96);
                                ws.send(JSON.stringify({ done: true }));
                                break;
                            }
        
                            const chunk = value.trim();
                            previousChunks += chunk;
        
                            // Send new bubble if a paragraph ends
                            if (chunk.includes("\n\n") || chunk.includes("```")) {
                                ws.send(JSON.stringify({ response: previousChunks, newBubble: true }));
                                previousChunks = "";
                            } else {
                                ws.send(JSON.stringify({ response: chunk }));
                            }
                        }
                    } catch (error) {
                        logColor("❌ Error in AI streaming", 91);
                        console.error(error);
                        ws.send(JSON.stringify({ error: "Error streaming response", done: true }));
                    }
                }, 100);
        
            } catch (error) {
                logColor("❌ WebSocket error in processing message", 91);
                console.error(error);
                ws.send(JSON.stringify({ error: "An error occurred while processing your request.", done: true }));
            }
        });
        
        ws.on("close", (code, reason) => {
            logColor(`WebSocket connection closed. Code ${code}\nReason: ${reason}`, 92);
        });
        ws.on("error", (error) => {
            logColor("❌ WebSocket encountered an error", 91);
            console.error(error);
        });
    });

    return wss;
};

module.exports = { setupWebSocketServer };