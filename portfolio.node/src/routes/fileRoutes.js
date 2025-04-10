const express = require("express");
const fileService = require("../services/fileService");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * @route GET /api/files/:id
 * @desc Retrieve file metadata by ID
 * @access Admin
 */
router.get("/:id", async (req, res) => {
  try {
    const file = await fileService.getFileMetadata(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch (error) {
    console.error("❌ Error fetching file metadata:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/files/download/:id
 * @desc Download a file from GridFS
 * @access Admin
 */
router.get("/public/:id", async (req, res) => {
  try {
    const file = await fileService.getFileMetadata(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Content-Type", file.metadata.contentType);
    fileService.getPublicFile(req.params.id).pipe(res);
  } catch (error) {
    console.error("❌ Error downloading file:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
