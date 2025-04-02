const cache = require("../utils/cache");
const { generateResponse } = require("./ollamaService");

/**
 * Generates and caches warm-up data on backend start.
 */
async function warmupLLM() {
    cache.set("warmup_complete", false); // Set warm-up as "not ready"

    console.log("🔄 Running initial LLM Warm-up...");

    try {
        await refreshGreetings(); // Refresh greetings immediately at startup
        await refreshChatContext(); // Cache chat context once at startup
        console.log("✅ Warm-up complete.");
    } catch (error) {
        console.error("🔥 Warm-up failed:", error);
    }

    cache.set("warmup_complete", true); // Set warm-up as "not ready"

}

/**
 * Refreshes the cached AI-generated greetings every 4 hours.
 */
async function refreshGreetings() {
    console.log("🔄 Refreshing cached greetings...");

    try {
        const greetingResponse = await generateResponse("AI Role: Butler. User query: generate 10 greetings in a string array json response.", {});
        const greetings = greetingResponse?.greetings || ["Hello! How can I assist you today?"];

        cache.set("chat_greetings", greetings, 14400); // Cache for 4 hours
        console.log(`✅ Cached ${greetings.length} greetings.`);
    } catch (error) {
        console.error("❌ Failed to refresh greetings:", error);
    }
}

/**
 * Generates and caches the default chat context once every 24 hours.
 */
async function refreshChatContext() {
    console.log("🔄 Generating default chat context...");

    try {
        const contextResponse = await generateResponse(
            "AI Role: AI Knowledge Assistant",
            "User query: Provide a detailed general knowledge base for answering user questions about projects, skills, and technology. Keep it structured and useful as a starting point.",
            {}
        );

        const defaultContext = contextResponse?.context || "This is an AI assistant for answering questions about projects and skills.";
        cache.set("chat_context", defaultContext, 86400); // Cache for 24 hours

        console.log("✅ Cached default chat context.");
    } catch (error) {
        console.error("❌ Failed to generate chat context:", error);
    }
}

function isWarmupComplete() {
    return cache.get("warmup_complete") || false;
}

module.exports = { warmupLLM, refreshGreetings, isWarmupComplete };
