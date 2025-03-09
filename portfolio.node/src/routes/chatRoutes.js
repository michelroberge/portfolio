// portfolio.node/src/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { processChat, getChatHistory, getRandomGreeting, getChatStartingContext } = require("../services/chatService");
const { isWarmupComplete } = require("../services/warmUpService");

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

/**
 * @route GET /api/chat/greeting
 * @desc Returns a random AI-generated greeting
 */
router.get("/greeting", async (req, res) => {
  try {
      const greeting = await getRandomGreeting();

    console.log(`greeting`, greeting);

      res.json({ greeting });
  } catch (error) {
      console.error("Error fetching greeting:", error);
      res.status(500).json({ error: "Failed to fetch greeting" });
  }
});

/**
 * @route GET /api/chat/context
 * @desc Returns the precomputed starting context for chat
 */
router.get("/context", async (req, res) => {
  try {
      const context = await getChatStartingContext();
      res.json({ context });
  } catch (error) {
      console.error("Error fetching chat context:", error);
      res.status(500).json({ error: "Failed to fetch chat context" });
  }
});


/**
 * @route GET /api/chat/warmup-status
 * @desc Returns whether the warm-up process is complete
 */
router.get("/warmup-status", (req, res) => {
  res.json({ warmupComplete: isWarmupComplete() });
});


module.exports = router;
