const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/admin");
const projectService = require("../../services/projectService");

const router = express.Router();

/**
 * @route POST /api/admin/projects
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
 * @route PUT /api/admin/projects/:id
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
 * @route DELETE /api/admin/projects/:id
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

module.exports = router;
