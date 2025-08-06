const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/admin");
const chatbotRequestLogService = require("../../services/chatbotRequestLogService");

const router = express.Router();

/**
 * @route GET /api/admin/chatbot-history
 * @desc Get chatbot request history with pagination
 * @access Admin
 */
router.get("/", authMiddleware, adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        
        const result = await chatbotRequestLogService.getChatbotHistory(page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error fetching chatbot history:", error.message);
        res.status(500).json({ error: "Failed to fetch chatbot history" });
    }
});

/**
 * @route DELETE /api/admin/chatbot-history/:id
 * @desc Delete a chatbot request log entry
 * @access Admin
 */
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await chatbotRequestLogService.deleteChatbotRequestLog(id);
        
        if (!deleted) {
            return res.status(404).json({ error: "Chatbot request log not found" });
        }
        
        res.json({ message: "Chatbot request log deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting chatbot request log:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 