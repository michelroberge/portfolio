const Project = require("../models/Project");

/**
 * Creates a new project.
 * @param {Object} data - Project data.
 * @returns {Promise<Object>} - The created project.
 */
async function createProject(data) {
  const project = new Project(data);
  await project.save();
  return project;
}

/**
 * Retrieves all projects.
 * @returns {Promise<Array>} - Array of projects.
 */
async function getAllProjects(filter = {}) {
  return Project.find(filter);
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

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
