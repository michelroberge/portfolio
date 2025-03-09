const Prompt = require("../models/Prompt");
const { searchEntitiesHybrid } = require("../services/searchService");
const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");
const { generateEmbeddings } = require("../services/embeddingService");

/**
 * Generates a structured AI prompt based on user input, retrieved context, and history.
 * @param {string} query - The user's question.
 * @param {array} history - Previous chat messages.
 * @param {string} webContext - Extracted web page content.
 * @returns {Promise<{ formattedPrompt: string, sources: string[] }>} - AI prompt and sources.
 */
async function generatePrompt(query, history = [], webContext = "") {
    try {
        // Fetch the AI prompt template dynamically
        const promptEntry = await Prompt.findOne({ name: "default_chat" });
        let promptTemplate = promptEntry ? promptEntry.template : getDefaultTemplate();

        // Generate embeddings and search for relevant documents
        const embeddingVector = await generateEmbeddings(query);
        const projects = await searchEntitiesHybrid(Project, query, 3);
        const blogs = await searchEntitiesHybrid(BlogEntry, query, 3);
        const pages = await searchEntitiesHybrid(Page, query, 2);

        // Combine retrieved results into a structured context
        let context = "";
        let sources = [];

        const formattedProjects = projects.map(p => `${p.title}: ${p.description}`).join("\n");
        const formattedBlogs = blogs.map(b => `${b.title}: ${b.content}`).join("\n");
        const formattedPages = pages.map(p => `${p.title}: ${p.content}`).join("\n");

        if (projects.length || blogs.length || pages.length) {
            context = `${formattedProjects}\n\n${formattedBlogs}\n\n${formattedPages}`;
            sources = [...projects, ...blogs, ...pages].map(doc => doc.title || "Unknown Source");
        } else {
            console.log(`⚠️ No relevant documents found for query: "${query}".`);
            context = "No directly related documents were found, but I'll still do my best to help.";
        }

        // Format WebContext for AI, if available
        const formattedWebContext = webContext
            ? `If the web context is provided, this is what the user currently sees, and can be used if the prompt is related:\n${webContext}`
            : "";

        // Replace placeholders in the prompt
        const formattedPrompt = promptTemplate
            .replace("{{query}}", query)
            .replace("{{history}}", formatChatHistory(history))
            .replace("{{webContext}}", formattedWebContext)
            .replace("{{context}}", context)
            .replace("{{projects}}", formattedProjects)
            .replace("{{blogs}}", formattedBlogs);

        return { formattedPrompt, sources };
    } catch (error) {
        console.error(`❌ Error generating AI prompt:`, error.message);
        return { formattedPrompt: "Sorry, an error occurred while generating the prompt.", sources: [] };
    }
}

/**
 * Formats the chat history into a structured string.
 * @param {array} history - Array of past chat messages.
 * @returns {string} - Formatted chat history.
 */
function formatChatHistory(history) {
    if (!history || history.length === 0) return "";
    return history.map(msg => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`).join("\n");
}

/**
 * Default AI prompt template for structured responses.
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

    ## Projects:
    {{projects}}

    ## Blogs:
    {{blogs}}

    ## Web Context:
    {{webContext}}

    ## Previous Conversation:
    {{history}}

    ---
    
    ## User Question:
    {{query}}

    ## AI Response:
    `.trim();
}


module.exports = { generatePrompt };
