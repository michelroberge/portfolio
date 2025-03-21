const { generateResponse, generateResponseStream } = require("./ollamaService");
const Prompt = require("../models/Prompt");
const defaultPrompts = require("../utils/prompts");

/**
 * Calls the configured LLM with a named prompt and parameters.
 * Supports streaming when `useStreaming` is true.
 */
async function queryLLMByName(promptName, parameters = {}, useStreaming = false) {
    try {
        if (!parameters || !parameters.userQuery) {
            console.warn("⚠️ queryLLMByName called with no query.");
            return null;
        }

        let promptDoc = await Prompt.findOne({ name: promptName });

        if (!promptDoc) {
            promptDoc = new Prompt(defaultPrompts[promptName]);
            promptDoc.name = promptName;
            await promptDoc.save();

            if (!promptDoc) {
                throw new Error(`❌ Unknown prompt: ${promptName}`);
            }
        }

        // 🟢 Restore parameter replacement
        let formattedPrompt = promptDoc.template || "";

        // Normalize parameter keys to lowercase
        const normalizedParams = Object.fromEntries(
            Object.entries(parameters).map(([key, value]) => [key.toLowerCase(), value])
        );

        // Replace placeholders dynamically
        if (formattedPrompt.includes("{")) {
            for (const [key, value] of Object.entries(normalizedParams)) {
                formattedPrompt = formattedPrompt.replace(new RegExp(`{${key}}`, "gi"), value);
            }
        }

        formattedPrompt += `\n\n[PROMPT ISO TIMESTAMP]\n${new Date().toISOString()}`;
        formattedPrompt += `\n\n[REFERENCE DATE]\nAssume today's date is ${new Date().toDateString()}.`;

        // console.log(`🤖 Sending formatted prompt to LLM (Streaming: ${useStreaming}):\n${formattedPrompt}`);

        if (useStreaming) {
            return generateResponseStream(formattedPrompt); // ✅ Streamed response
        } else {
            return await generateResponse(formattedPrompt); // ✅ Full response
        }
    } catch (error) {
        console.error("❌ LLM query failed:", error);
        return null;
    }
}

module.exports = { queryLLMByName };
