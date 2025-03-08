const Project = require("../models/Project");
const { storeEmbedding, searchQdrant } = require("../services/qdrantService");
const {getNextVectorId} = require("../services/counterService");
const { generateEmbeddings } = require("./embeddingService");

/**
 * Creates a new project.
 * @param {Object} data - Project data.
 * @returns {Promise<Object>} - The created project.
 */
async function createProject(data) {
  const project = new Project(data);
  await project.save();

  const textToEmbed = `${project.title} ${project.description} ${project.tags.join(" ")} ${project.industry}`;
  const embedding = await generateEmbeddings(textToEmbed);

  if (embedding) {
    await storeEmbedding(project._id, textToEmbed, embedding);
  }

  return project;
}

/**
 * Retrieves all projects.
 * @returns {Promise<Array>} - Array of projects.
 */

async function getAllProjects(filter = {}) {
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  return projects;
}


/**
 * Retrieves a project by its ID.
 * @param {string} id - The project ID.
 * @returns {Promise<Object|null>} - The found project or null.
 */
async function getProjectById(id) {
  return Project.findById(id);
}

/**
 * Updates a project by its ID.
 * @param {string} id - The project ID.
 * @param {Object} data - Data to update.
 * @returns {Promise<Object|null>} - The updated project or null.
 */
async function updateProject(id, data) {
  return Project.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Deletes a project by its ID.
 * @param {string} id - The project ID.
 * @returns {Promise<Object|null>} - The deleted project or null.
 */
async function deleteProject(id) {
  return Project.findByIdAndDelete(id);
}


async function generateEmbeddingsAndStore(project) {
  const text = `${project.title} ${project.description} ${project.tags.join(" ")} ${project.industry}`;
  
  if (!project.vectorId) {
    project.vectorId = await getNextVectorId("vectorId");  // ✅ Assign unique, thread-safe Qdrant ID
    await project.save();
  }

  // 1️⃣ Generate the embedding vector
  const vector = await generateEmbeddings(text);
  
  if (!vector) {
    console.error(`❌ Failed to generate embedding for project: ${project._id}`);
    return;
  }

  // 2️⃣ Store the embedding in Qdrant
  await storeEmbedding(project.vectorId, text, vector);  
}

/**
 * Search the project collection
 * @param {string} search - search text
 * @returns {Promise<Object|null>} - The search response
 */
async function searchProjects(search) {
  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const embedding = await generateEmbeddings(query);
  if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });

  const results = await searchQdrant(embedding, "projects");  // ✅ Always searches in "projects"
  res.json(results);
}


module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  generateEmbeddingsAndStore,
  searchProjects
};
