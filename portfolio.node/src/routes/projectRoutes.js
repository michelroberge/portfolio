const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const projectService = require("../services/projectService");
const Project = require("../models/Project"); // For dynamic search
const { searchEntitiesHybrid } = require("../services/searchService");

const router = express.Router();

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Admin
 */
router.post("/", authMiddleware, adminAuth, async (req, res) => {
    try {
        const newProject = await projectService.createProject(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        console.error("❌ Error creating project:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/projects
 * @desc Retrieve all projects
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        const filter = { isDraft: false, publishAt: { $lte: new Date() } }; // Public filter
        const projects = await projectService.getAllProjects(filter);
        res.json(projects);
    } catch (error) {
        console.error("❌ Error fetching projects:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/projects/:id
 * @desc Retrieve a single project by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (error) {
        console.error("❌ Error fetching project:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /api/projects/:id
 * @desc Update a project by ID
 * @access Admin
 */
router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const updatedProject = await projectService.updateProject(req.params.id, req.body);
        if (!updatedProject) return res.status(404).json({ error: "Project not found" });
        res.json(updatedProject);
    } catch (error) {
        console.error("❌ Error updating project:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project by ID
 * @access Admin
 */
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const deleted = await projectService.deleteProject(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting project:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/projects/generate-embeddings
 * @desc Refresh project embeddings (delta or full)
 * @access Admin
 */
router.post("/generate-embeddings", authMiddleware, adminAuth, async (req, res) => {
    try {
        const { fullRefresh = false } = req.body; // If `true`, refresh all embeddings
        const result = await projectService.refreshProjectEmbeddings(fullRefresh);
        res.json(result);
    } catch (error) {
        console.error("❌ Error generating embeddings:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/projects/search
 * @desc Perform a hybrid search (full-text + vector)
 * @access Public
 */
router.post("/search", async (req, res) => {
    try {
        const { query, limit, minScore } = req.body;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const results = await searchEntitiesHybrid(Project, query, limit, minScore);
        res.json(results);
    } catch (error) {
        console.error("❌ Error searching projects:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
