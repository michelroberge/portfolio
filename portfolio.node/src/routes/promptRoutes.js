const express = require("express");
const {
    getAllPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt
} = require("../services/promptService");

const isAdmin = require("../middlewares/admin"); // Ensure only admins manage prompts
const router = express.Router();

/**
 * @route GET /api/prompts
 * @desc Retrieve all stored prompts
 * @access Admin
 */
router.get("/", isAdmin, async (req, res) => {
    try {
        const prompts = await getAllPrompts();
        res.status(200).json(prompts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/prompts/:id
 * @desc Retrieve a specific prompt by ID
 * @access Admin
 */
router.get("/:id", isAdmin, async (req, res) => {
    try {
        const prompt = await getPromptById(req.params.id);
        res.status(200).json(prompt);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @route POST /api/prompts
 * @desc Create a new prompt
 * @access Admin
 */
router.post("/", isAdmin, async (req, res) => {
    try {
        const prompt = await createPrompt(req.body);
        res.status(201).json(prompt);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route PUT /api/prompts/:id
 * @desc Update an existing prompt
 * @access Admin
 */
router.put("/:id", isAdmin, async (req, res) => {
    try {
        const prompt = await updatePrompt(req.params.id, req.body);
        res.status(200).json(prompt);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/prompts/:id
 * @desc Delete a prompt
 * @access Admin
 */
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        await deletePrompt(req.params.id);
        res.status(200).json({ message: "Prompt deleted successfully." });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
