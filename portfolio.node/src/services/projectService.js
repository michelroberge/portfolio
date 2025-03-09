const Project = require("../models/Project");
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding, deleteEmbedding, initCollection } = require("./qdrantService");
const { searchEntitiesHybrid } = require("./searchService");

/**
 * Create a new project and store its embedding.
 * @param {Object} data - Project data
 * @returns {Promise<Object>} Created project
 */
async function createProject(data) {
    const project = new Project(data);
    await project.save();

    // Generate and store embedding
    await updateProjectEmbeddings(project);

    return project;
}

/**
 * Update an existing project and optionally refresh embeddings.
 * @param {string} id - Project ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated project
 */
async function updateProject(id, updates) {
    const project = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!project) return null;

    // If description/title/tags change, regenerate embeddings
    if (updates.title || updates.description || updates.tags) {
        await updateProjectEmbeddings(project);
    }

    return project;
}

/**
 * Delete a project and remove its embedding from Qdrant.
 * @param {string} id - Project ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function deleteProject(id) {
    const project = await Project.findByIdAndDelete(id);
    if (!project) return false;

    await deleteEmbedding("projects", project._id);
    return true;
}

/**
 * Retrieve a single project by ID.
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Project object
 */
async function getProjectById(id) {
    return Project.findById(id);
}

/**
 * Retrieve all projects with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Array>} List of projects
 */
async function getAllProjects(filter = {}) {
    return Project.find(filter);
}

/**
 * Generate embeddings for a single project and store them in Qdrant.
 * @param {Object} project - Project object
 */
async function updateProjectEmbeddings(project) {
    const text = `${project.title} ${project.description} ${project.tags?.join(" ")} ${project.industry || ""}`;
    
    const embedding = await generateEmbeddings(text);
    if (!embedding) throw new Error(`Failed to generate embedding for project: ${project._id}`);

    await storeEmbedding("projects", project._id, embedding, {
        title: project.title,
        tags: project.tags || [],
        industry: project.industry || "",
    });
}

/**
 * Refresh all or only changed embeddings.
 * @param {boolean} fullRefresh - If true, refresh all embeddings; otherwise, only update modified projects.
 */
async function refreshProjectEmbeddings(fullRefresh = false) {
    const filter = fullRefresh ? {} : { updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }; // Last 24h updates
    const projects = await getAllProjects(filter);

    for (const project of projects) {
        await updateProjectEmbeddings(project);
    }

    return { message: `Refreshed ${projects.length} project embeddings.` };
}

/**
 * Search projects using semantic vector search.
 * @param {string} query - User's search query
 * @returns {Promise<Array>} List of matching projects
 */
async function searchProjects(query) {
  return searchEntitiesHybrid(Project, query);
}

/**
 * Initializes embeddings for the Project model.
 */
async function initializeProjectEmbeddings() {
    const collectionName = Project.collection.collectionName; // Use MongoDB model's collection name
    console.log(`🔄 Initializing embeddings for "${collectionName}"...`);

    // 1️⃣ Ensure Qdrant collection exists
    await initCollection(collectionName);

    // 2️⃣ Fetch all documents from MongoDB
    const documents = await Project.find({});
    if (!documents.length) {
        console.log(`⚠️ No documents found in "${collectionName}", skipping.`);
        return;
    }

    // 3️⃣ Generate & Store Embeddings
    for (const doc of documents) {
        if ( !doc.vectorId){
            // trigger vector generation
            await doc.save();
        }
        const text = `${doc.title} ${doc.description || ""}`;
        if (!text.trim()) continue;

        const embedding = await generateEmbeddings(text);
        if (!embedding) {
            console.error(`❌ Failed to generate embedding for ${collectionName}: ${doc._id}`);
            continue;
        }

        await storeEmbedding(collectionName, doc.vectorId, embedding, {
            title: doc.title,
            tags: doc.tags || [],
        });

        console.log(`✅ Stored embedding for "${collectionName}" -> ${doc.title}`);
    }
}

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getAllProjects,
    updateProjectEmbeddings,
    refreshProjectEmbeddings,
    searchProjects,
    initializeProjectEmbeddings
};
