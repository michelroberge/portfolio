const Prompt = require("../models/Prompt");

/**
 * Generates an AI prompt based on search results and user history
 */
async function generatePrompt(query, history = [], context = "") {
    try {
        const promptEntry = await Prompt.findOne({ name: "default_chat" });
        let promptTemplate = promptEntry ? promptEntry.template : getDefaultTemplate();

        const formattedPrompt = promptTemplate
            .replace("{{query}}", query)
            .replace("{{history}}", formatChatHistory(history))
            .replace("{{context}}", context);

        return { formattedPrompt };
    } catch (error) {
        console.error(`❌ Error generating AI prompt:`, error.message);
        return { formattedPrompt: "Sorry, an error occurred while generating the prompt." };
    }
}

/**
 * Formats chat history into a structured string
 */
function formatChatHistory(history) {
    return history.map(msg => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`).join("\n");
}

/**
 * Converts different entity types into a structured text format
 */
function convertToText(entity) {
    if (!entity) return "";

    switch (entity.type) {
        case "Project":
            return `Project: ${entity.title}\nDescription: ${entity.description || "No description available"}\nTags: ${entity.tags?.join(", ") || "None"}\nPublished: ${entity.publishAt || "Unknown date"}`;

        case "BlogEntry":
            return `Blog: ${entity.title}\nContent: ${entity.content || "No content available"}\nTags: ${entity.tags?.join(", ") || "None"}\nPublished: ${entity.publishAt || "Unknown date"}`;

        case "Page":
            return `Page: ${entity.title}\nContent: ${entity.content || "No content available"}`;

        case "FileEntry":
            return `File: ${entity.filename}\nExtracted Text: ${entity.extractedText || "No extracted text available"}`;

        default:
            return `Unknown Type: ${JSON.stringify(entity)}`;
    }
}

/**
 * Returns the default AI prompt template for structured responses.
 */
function getDefaultTemplate() {
    return `
    # AI Role
    You are an AI assistant designed to showcase a developer's portfolio. Your primary goal is to **provide accurate and relevant answers** based only on the provided context.

    **DO NOT invent answers or respond with information outside the given context.**
    If the user asks something unrelated to the portfolio, politely redirect them.

    ## Guidelines:
    - **Projects:** Focus only on projects listed in the context. Summarize their key aspects but do not assume unlisted details.
    - **Blogs:** If relevant blog entries exist, use them to provide insights. Do not generalize beyond their content.
    - **Web Context:** If web context is provided, it represents what the user currently sees. Use it only if it applies to their query.
    - **Search Ranking:** Prioritize projects first, then blog posts, then other context.
    - **Out of Scope:** If a request is about unrelated topics (e.g., politics, personal finance, or non-tech topics), **politely decline**.

    ---
    
    ## Context:
    {{context}}

    ## Previous Conversation:
    {{history}}

    ## User Question:
    {{query}}

    ## AI Response:
    `.trim();
}

module.exports = { generatePrompt, convertToText, getDefaultTemplate };
