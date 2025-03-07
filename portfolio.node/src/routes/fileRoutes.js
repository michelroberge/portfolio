const express = require("express");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

const router = express.Router();

const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

/**
 * 📌 Upload a file (Admins Only)
 */
router.post("/upload", isAuth, isAdmin, async (req, res) => {

  if (!req.headers["content-type"]) {
    console.error("No content-type");
    return res.status(400).json({ error: "Invalid request: No file detected" });
  }

  const { entityId, context, isPublic } = req.query; // Extract metadata from query params

  const filename = req.headers["x-filename"] || "uploaded_file"; // Get filename from headers
  const contentType = req.headers["content-type"];
  const size = req.headers["content-length"];

  const uploadStream = gridFSBucket.openUploadStream(filename, {
    metadata: {
      contentType,
      uploadedBy: req.user._id,
      isPublic: isPublic === "true",
      entityId,
      context, 
      size
    },
  });

  req.pipe(uploadStream); // Stream request body into GridFS

  uploadStream.on("finish", () => {

    res.status(201).json({ message: "File uploaded successfully" });
  });

  uploadStream.on("error", (err) => {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  });
});

/**
 * 📌 Get File Metadata
 */
router.get("/:id", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!file) return res.status(404).json({ error: "File not found" });

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Serve Public Files (No Auth)
 */
router.get("/public/:id", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (!file || !file.metadata.isPublic) {
      return res.status(403).json({ error: "Unauthorized or file not found" });
    }

    const readStream = gridFSBucket.openDownloadStream(file._id);
    res.set("Content-Type", file.metadata.contentType);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Serve Private Files (Admins Only)
 */
router.get("/private/:id", isAuth, isAdmin, async (req, res) => {

  try {
    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (!file) return res.status(404).json({ error: "File not found" });

    const readStream = gridFSBucket.openDownloadStream(file._id);
    res.set("Content-Type", file.metadata.contentType);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

/**
 * 📌 Delete a File (Admins Only)
 */
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    await gridFSBucket.delete(new mongoose.Types.ObjectId(req.params.id));
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting file" });
  }
});

/**
 * 📌 Get Files by Reference ID & Context
 */
router.get("/", async (req, res) => {
    const { entityId, context } = req.query;
  
    if (!entityId || !context) {
      return res.status(400).json({ error: "Missing entityId or context" });
    }
  
    try {
      const files = await gfs.files.find({ "metadata.entityId": entityId, "metadata.context": context }).toArray();
      res.json(files);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving files" });
    }
  });

  
module.exports = router;
