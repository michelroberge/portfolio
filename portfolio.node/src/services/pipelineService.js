const { queryLLMByName } = require("../services/llmService");
const { fetchRelevantData } = require("../services/dataFetcherService");
const { generateEmbeddings } = require("../services/embeddingService");

/**
 * Executes an AI query pipeline.
 */
async function executePipeline(promptName, parameters, isStreaming = false, streamCallback = null) {
    try {
        // if (isStreaming && streamCallback) streamCallback({ response: "🔄 Starting AI pipeline...", step: "starting" });

        if (isStreaming && streamCallback) streamCallback({ response: "🔍 Analyzing prompt...", step: "starting" });

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

        if (isStreaming && streamCallback) streamCallback({ response: "🤖 Generating AI response...", step: true });

        const grResponse = await queryLLMByName("guardrail", parameters, false);
        const block = grResponse?.block || "no"; 
        console.log(`guardrail response`, grResponse);
        if ( block == "yes"){
            if (isStreaming && streamCallback) streamCallback({ response: `Sorry, I am not allowed to answer this. ${grResponse.reason || "" }`, step: false, done: true });
            return { response: `Sorry, I am not allowed to answer this. ${grResponse.reason}`, step: false, done: true };
        }

        // Step 4️⃣: Execute AI Query
        const responseStream = await queryLLMByName(promptName, parameters, true);

        const reader = responseStream.getReader();
let responseBuffer = "";

while (true) {
    const { done, value } = await reader.read();
    if (done) {
        if (responseBuffer.trim().length > 0) {
            streamCallback({ response: responseBuffer, done: true, step: false });
        }
        break;
    }

    responseBuffer += value; 

    // ✅ Stream only when there's a space or punctuation, avoiding mid-word splits
    if (value.includes(" ") || value.match(/[.,!?]/) || done === true) {
        streamCallback({ response: responseBuffer, step: false });
        responseBuffer = ""; // Reset buffer after sending
    }
}

        return { response: "Streaming response handled separately." };
    } catch (error) {
        if (isStreaming && streamCallback) streamCallback({ response: `❌ Error: ${error.message}` });
        return { response: "An error occurred while processing your request." };
    }
}

module.exports = { executePipeline };
