const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

/**
 * Upload a file to GridFS
 */
async function uploadFile(req, entityId, context, isPublic) {
  return new Promise((resolve, reject) => {
    if (!req.headers["content-type"]) {
      return reject("Invalid request: No file detected");
    }

    const filename = req.headers["x-filename"] || "uploaded_file";
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

    req.pipe(uploadStream);

    uploadStream.on("finish", () => {
      resolve({ message: "File uploaded successfully", filename });
    });

    uploadStream.on("error", (err) => reject(err));
  });
}

/**
 * Get file metadata by ID
 */
async function getFileMetadata(id) {
  return await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) });
}

/**
 * Serve public files
 */
async function getPublicFile(id) {
  const file = await getFileMetadata(id);
  if (!file || !file.metadata.isPublic) return null;
  return gridFSBucket.openDownloadStream(file._id);
}

/**
 * Serve private files (Admins Only)
 */
async function getPrivateFile(id) {
  const file = await getFileMetadata(id);
  if (!file) return null;
  return gridFSBucket.openDownloadStream(file._id);
}

/**
 * Delete a file
 */
async function deleteFile(id) {
  await gridFSBucket.delete(new mongoose.Types.ObjectId(id));
}

/**
 * Get files by entity reference & context
 */
async function getFilesByContext(entityId, context) {
  return await gfs.files.find({ "metadata.entityId": entityId, "metadata.context": context }).toArray();
}

async function getAllFiles() {
    const mediaTypes = ["image/", "video/", "audio/"]; // Exclude media files
    const files = await gfs.files.find().toArray();
  
    return files
      .filter(file => !mediaTypes.some(type => file.metadata.contentType.startsWith(type)))
      .map(file => ({
        _id: file._id,
        filename: file.filename,
        contentType: file.metadata.contentType,
        entityId: file.metadata.entityId,
        context: file.metadata.context,
        tags: file.metadata.tags || [],
      }));
  }

/**
 * Extract text from files for embedding processing
 */
async function extractFileText(file) {
  // Placeholder: Implement text extraction logic here
  return `Extracted text from ${file.filename}`;
}

module.exports = {
  uploadFile,
  getFileMetadata,
  getPublicFile,
  getPrivateFile,
  deleteFile,
  getFilesByContext,
  getAllFiles,
  extractFileText,
};
