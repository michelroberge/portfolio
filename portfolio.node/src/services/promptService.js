const Prompt = require("../models/Prompt");

/**
 * Retrieves all stored prompts.
 */
async function getAllPrompts() {
    return await Prompt.find();
}

/**
 * Retrieves a specific prompt by ID.
 */
async function getPromptById(id) {
    const prompt = await Prompt.findById(id);
    if (!prompt) {
        throw new Error("Prompt not found.");
    }
    return prompt;
}

/**
 * Creates a new AI prompt.
 */
async function createPrompt({ name, template, metadata = {} }) {
    if (await Prompt.findOne({ name })) {
        throw new Error("A prompt with this name already exists.");
    }
    
    return await Prompt.create({ name, template, metadata });
}

/**
 * Updates an existing prompt.
 */
async function updatePrompt(id, { name, template, metadata }) {
    const prompt = await Prompt.findByIdAndUpdate(id, { name, template, metadata }, { new: true });
    if (!prompt) {
        throw new Error("Prompt not found.");
    }
    return prompt;
}

/**
 * Deletes a prompt by ID.
 */
async function deletePrompt(id) {
    const prompt = await Prompt.findByIdAndDelete(id);
    if (!prompt) {
        throw new Error("Prompt not found.");
    }
    return prompt;
}

module.exports = {
    getAllPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt
};
