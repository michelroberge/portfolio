const { queryLLMByName } = require("../services/llmService");
const { fetchRelevantData } = require("../services/dataFetcherService");
const { generateEmbeddings } = require("../services/embeddingService");

/**
 * Executes an AI query pipeline.
 */
async function executePipeline(promptName, parameters, isStreaming = false, streamCallback = null) {
    try {
        // if (isStreaming && streamCallback) streamCallback({ response: "🔄 Starting AI pipeline...", step: "starting" });

        // Step 1️⃣: Detect Intent
        if (isStreaming && streamCallback) streamCallback({ response: "🔍 Detecting user intent...", step: "starting" });
        const intentResponse = await queryLLMByName("intent-detection", { userQuery: parameters.userQuery }, false);
        const intent = intentResponse?.intent || "general_knowledge"; 
        if (isStreaming && streamCallback) streamCallback({ response: `🎯 Identified intent: ${intent}`, step: "starting" });

        // Step 2️⃣: Convert User Query to Vector for Qdrant
        if (isStreaming && streamCallback) streamCallback({ response: "🧠 Generating query embeddings...", step: "starting" });
        parameters.queryVector = await generateEmbeddings(parameters.userQuery);

        // Step 3️⃣: Fetch Relevant Data
        if (isStreaming && streamCallback) streamCallback({ response: `📡 Retrieving relevant ${intent} data...`, step: "starting" });
        parameters.context = await fetchRelevantData(parameters, intent);
        if (isStreaming && streamCallback) streamCallback({ response: "✅ Data retrieval complete.", step: "starting" });

        // Step 4️⃣: Execute AI Query
        if (isStreaming && streamCallback) streamCallback({ response: "🤖 Generating AI response..." });
        const responseStream = await queryLLMByName(promptName, parameters, isStreaming);

        const reader = responseStream.getReader();
        let responseBuffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                streamCallback({ done: true });
                break;
            }

            responseBuffer += value;

            // ✅ Stream words immediately but separate paragraphs
            if (value.includes(" ")) {
                streamCallback({ response: value.trim() });
            }

            if (value.includes("\n\n")) {
                streamCallback({ response: "🔽 New Paragraph 🔽" }); // Placeholder to mark paragraph shift
            }
        }

        return { response: "Streaming response handled separately." };
    } catch (error) {
        if (isStreaming && streamCallback) streamCallback({ response: `❌ Error: ${error.message}` });
        return { response: "An error occurred while processing your request." };
    }
}

module.exports = { executePipeline };
