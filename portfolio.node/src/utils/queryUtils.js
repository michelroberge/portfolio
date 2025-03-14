const { queryLLMByName } = require("../services/llmService");
const defaultPrompts = require("./prompts");

/**
 * Uses LLM to extract structured metadata from a user query.
 * @param {string} userQuery - The user's query input.
 * @returns {Promise<object>} - Extracted metadata (category, technologies, dates, named entities).
 */
async function extractMetadataFromQuery(userQuery) {
    console.log(`🔍 Extracting metadata using LLM for query: "${userQuery}"`);

    try {
        // Call LLM with structured metadata prompt
        const response = await queryLLMByName("metadata-extraction", { userQuery });

        // Ensure the response is structured JSON
        if (response && typeof response === "object") {
            console.log(`✅ Extracted Metadata:`, response);
            return response;
        }

        console.warn("⚠️ LLM returned an unstructured response. Defaulting to empty metadata.");
        return {};
    } catch (error) {
        console.error("❌ Metadata extraction via LLM failed:", error);
        return {};
    }
}

module.exports = { extractMetadataFromQuery };
