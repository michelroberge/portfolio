const fs = require("fs");
const path = require("path");
const qdrantService = require("./qdrantService");
const embeddingModel = require("./ollamaService"); // Uses Ollama for embeddings
const Embedding = require("../models/Embedding");

/**
 * Parses a local directory and generates embeddings for contained files.
 */
async function parseLocalDirectory(directoryPath, includeExtensions = [], metadata = {}) {
    if (!fs.existsSync(directoryPath)) {
        throw new Error("Directory does not exist.");
    }

    const files = fs.readdirSync(directoryPath).filter(file =>
        includeExtensions.length === 0 || includeExtensions.includes(path.extname(file))
    );

    const results = [];

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const content = fs.readFileSync(filePath, "utf-8");

        const embedding = await embeddingModel.generateEmbedding(content);
        const embeddingEntry = await qdrantService.storeEmbedding(filePath, content, metadata);

        results.push(embeddingEntry);
    }

    return { message: "Embeddings generated", results };
}

/**
 * Updates metadata for a given embedding entry.
 */
async function updateEmbeddingMetadata(id, metadata) {
    const embedding = await Embedding.findByIdAndUpdate(id, { metadata }, { new: true });
    if (!embedding) {
        throw new Error("Embedding not found.");
    }
    return embedding;
}

/**
 * Retrieves all stored embeddings.
 */
async function listEmbeddings() {
    return await Embedding.find();
}

module.exports = {
    parseLocalDirectory,
    updateEmbeddingMetadata,
    listEmbeddings,
};
