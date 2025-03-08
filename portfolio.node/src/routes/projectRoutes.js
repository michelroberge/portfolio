const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const projectService = require("../services/projectService");
const Project = require("../models/Project");
const { generateEmbeddings } = require("../services/embeddingService");

const router = express.Router();

// Create a new project using the service module
router.post("/", authMiddleware, adminAuth, async (req, res) => {
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
    let filter = {};
    if (!req.cookies["auth-token"]) {
      filter = { 
        isDraft: false, 
        publishAt: { $lte: new Date() }
      };
    }
    const projects = await projectService.getAllProjects(filter);
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
router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const updatedProject = await projectService.updateProject(req.params.id, req.body);
    if (!updatedProject) return res.status(404).json({ error: "Project not found" });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project by ID using the service module
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const deletedProject = await projectService.deleteProject(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-embeddings", authMiddleware, adminAuth, async (req, res) => {
  const projects = await Project.find();
  for (const project of projects) {
    await projectService.generateEmbeddingsAndStore(project);
  }
  res.json({ message: "Embeddings generated for all projects." });
});

router.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const embedding = await generateEmbeddings(query);
  if (!embedding) return res.status(500).json({ message: "Failed to generate query embedding" });

  const results = await searchProjects(embedding);
  res.json(results);
});


module.exports = router;
