const express = require("express");
const authMiddleware = require("../middlewares/auth");
const projectService = require("../services/projectService");
const router = express.Router();

// Create a new project using the service module
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects using the service module
router.get("/", async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single project by ID using the service module
router.get("/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a project by ID using the service module
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProject = await projectService.updateProject(req.params.id, req.body);
    if (!updatedProject) return res.status(404).json({ error: "Project not found" });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project by ID using the service module
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProject = await projectService.deleteProject(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
