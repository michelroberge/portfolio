// portfolio.node/src/routes/providerConfigRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/auth");
const providerConfigService = require("../services/providerConfigService");
const router = express.Router();

// GET /api/provider-configs: Retrieve all provider configurations.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const configs = await providerConfigService.getAllConfigs();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/provider-configs/:provider: Update configuration for a specific provider.
router.put("/:provider", authMiddleware, async (req, res) => {
  try {
    const { provider } = req.params;
    const configData = req.body;
    const updatedConfig = await providerConfigService.updateConfig(provider, configData);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
