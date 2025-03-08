const express = require("express");
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");
const fileService = require("../services/fileService");

const router = express.Router();

/**
 * 📌 Upload a file (Admins Only)
 */
router.post("/upload", isAuth, isAdmin, async (req, res) => {
  try {
    const { entityId, context, isPublic } = req.query;
    const uploadedFile = await fileService.uploadFile(req, entityId, context, isPublic);
    res.status(201).json(uploadedFile);
  } catch (error) {
    console.error("File upload failed:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

/**
 * 📌 Get File Metadata
 */
router.get("/:id", async (req, res) => {
  try {
    const file = await fileService.getFileMetadata(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Serve Public Files (No Auth)
 */
router.get("/public/:id", async (req, res) => {
  try {
    const stream = await fileService.getPublicFile(req.params.id);
    if (!stream) return res.status(403).json({ error: "Unauthorized or file not found" });

    res.set("Content-Type", stream.metadata.contentType);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Serve Private Files (Admins Only)
 */
router.get("/private/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const stream = await fileService.getPrivateFile(req.params.id);
    if (!stream) return res.status(404).json({ error: "File not found" });

    res.set("Content-Type", stream.metadata.contentType);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Delete a File (Admins Only)
 */
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await fileService.deleteFile(req.params.id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting file" });
  }
});

/**
 * 📌 Get Files by Reference ID & Context
 */
router.get("/", async (req, res) => {
  try {
    const { entityId, context } = req.query;
    if (!entityId || !context) return res.status(400).json({ error: "Missing entityId or context" });

    const files = await fileService.getFilesByContext(entityId, context);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving files" });
  }
});

module.exports = router;
