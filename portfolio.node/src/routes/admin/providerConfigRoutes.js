// portfolio.node/src/routes/providerConfigRoutes.js
const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const providerConfigService = require("../../services/providerConfigService");
const router = express.Router();



// PUT /api/provider-configs/:provider: Update configuration for a specific provider.
router.put("/:provider", authMiddleware, async (req, res) => {
  try {

    if  (!req.user?.isAdmin === true){
      res.status(403);
    }

    const { provider } = req.params;
    const configData = req.body;
    const updatedConfig = await providerConfigService.updateConfig(provider, configData);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/provider-configs: Retrieve all provider configurations.
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const configs = await providerConfigService.getAllConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/provider-configs/ai: Retrieve AI model configuration.
router.get("/ai", authMiddleware, async (req, res) => {
  try {
    const config = await providerConfigService.getAIConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch AI configuration" });
  }
});

// PUT /api/provider-configs/ai: Update AI model configuration.
router.put("/ai", authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { provider, clientId, clientSecret } = req.body;
    if (!["ollama", "openai"].includes(provider)) {
      return res.status(400).json({ error: "Invalid provider" });
    }

    const updatedConfig = await providerConfigService.updateConfig(provider, { clientId, clientSecret });
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: "Failed to update AI configuration" });
  }
});

module.exports = router;
