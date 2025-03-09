// portfolio.node/src/services/llmService.js
const { generateResponse } = require("./ollamaService"); // Assuming aiService handles both providers

/**
 * Calls the configured LLM with a given prompt and expected JSON output.
 * @param {string} systemRole - The role of the LLM (e.g., "Search Assistant", "Chat Assistant").
 * @param {string} userQuery - The user input or instruction.
 * @param {object} extraParams - Any additional data for context (e.g., available collections).
 * @returns {Promise<object>} - The LLM response as JSON.
 */
async function queryLLM(systemRole, userQuery, extraParams = {}) {
    const promptObject  = {
        role: systemRole,
        task: userQuery,
        context: extraParams,
        output_format: "JSON"
    };

    const formattedPrompt = `You are an AI assistant. 
    Please respond in JSON format. 
    Here is the task:\n${JSON.stringify(promptObject, null, 2)}`;

    try {
        // Choose the AI provider dynamically
        const llmResponse =await generateResponse(formattedPrompt);
        return JSON.parse(llmResponse.response); // Ensure response is parsed into JSON
    } catch (error) {
        console.error("LLM query failed:", error);
        return null;
    }
}

module.exports = { queryLLM };
