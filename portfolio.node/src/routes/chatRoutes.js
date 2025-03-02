// portfolio.node/src/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { processChat, getChatHistory } = require("../services/chatService");

/**
 * @route POST /api/chat
 * @desc Process user query with AI model
 */
router.post("/", async (req, res) => {
  try {
      const { sessionId, query, history, webContext } = req.body;
      const response = await processChat(sessionId, query, history || [], webContext || "");
      
      res.status(200).json({ response });
  } catch (error) {
      console.error("❌ Chat API error:", error.message);
      res.status(500).json({ error: error.message });
  }
});

/**
 * GET /chat
 * Retrieves the chat history for a given session.
 */
router.get("/", async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const history = await getChatHistory(sessionId);
    return res.status(200).json(history);
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
