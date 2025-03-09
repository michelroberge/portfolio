const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const fileService = require("../services/fileService");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * @route POST /api/files
 * @desc Upload a new file to GridFS
 * @access Admin
 */
router.post("/", authMiddleware, adminAuth, async (req, res) => {
  try {
    const { entityId, context, isPublic } = req.body;
    const newFile = await fileService.uploadFile(req, entityId, context, isPublic);
    res.status(201).json(newFile);
  } catch (error) {
    console.error("❌ Error uploading file:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/files
 * @desc Retrieve all file metadata
 * @access Admin
 */
router.get("/", authMiddleware, adminAuth, async (req, res) => {
  try {
    const files = await fileService.getAllFiles();
    res.json(files);
  } catch (error) {
    console.error("❌ Error fetching files:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/files/:id
 * @desc Retrieve file metadata by ID
 * @access Admin
 */
router.get("/:id", authMiddleware, adminAuth, async (req, res) => {
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
router.get("/download/:id", authMiddleware, adminAuth, async (req, res) => {
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

/**
 * @route DELETE /api/files/:id
 * @desc Delete a file from GridFS
 * @access Admin
 */
router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
  try {
    const deleted = await fileService.deleteFile(req.params.id);
    if (!deleted) return res.status(404).json({ error: "File not found" });
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting file:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
