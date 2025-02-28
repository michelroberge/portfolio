// portfolio.node/src/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { processChatMessage, getChatHistory } = require("../services/chatService");

/**
 * POST /chat
 * Handles a new chat message, retrieves relevant context, and generates an AI response.
 */
router.post("/", async (req, res) => {
  try {
    const { sessionId, query } = req.body;
    if (!sessionId || !query) {
      return res.status(400).json({ error: "sessionId and query are required." });
    }

    const response = await processChatMessage(sessionId, query);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error processing chat message:", error);
    return res.status(500).json({ error: "Internal server error." });
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
