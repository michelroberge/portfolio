const Prompt = require("../models/Prompt");
const { searchAcrossCollections } = require("../services/qdrantService");
const projectService = require("../services/projectService");
const blogService = require("../services/blogService");
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
        const vectors = await generateEmbeddings(query);
        const relatedDocs = await searchAcrossCollections(vectors, 10, 0.5);

        // Format context from retrieved documents
        let context = "";
        let sources = [];
        let projectContext = "";
        let blogEntries = "";

        if (relatedDocs.length > 0) {
            context = relatedDocs.map((doc) => doc.payload.text).join("\n");
            sources = relatedDocs.map((doc) => doc.source || "Unknown source");
        } else {

            const projects = await projectService.getAllProjects();
            const blogs = await blogService.getAllBlogEntries();

            projectContext = JSON.stringify(projects);
            blogEntries = JSON.stringify(blogs);

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
            .replace("{{projects}}", projectContext)
            .replace("{{blogs}}", blogEntries);

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

function getDefaultTemplate(){
    return  `
    # AI Role
    AI assistant helping showcase a developer's portfolio. 
    The user is someone accessing the developer's site who is interested in that developer knowledge, skill and/or backgroudn.
    The AI ONLY use the provided context to answer questions.
    If a question is about projects, focus specifically on projects in the provided context.
    If the question is unrelated to context, you can answer unless:
    - it is illegal
    - dangerous
    - is outside the concept of the portfolio showcasing a developer's background and skills.
    
    ### Context:
    {{context}}

    ### Projects:
    {{projects}}

    ### Blogs:
    {{blogs}}

    ### WebContext:
    {{webContext}} 

    ### Discussion History:
    {{history}}

    ### User Question:
    {{query}}
    
    ### AI Response:
    `.trim();
}
module.exports = { generatePrompt };
