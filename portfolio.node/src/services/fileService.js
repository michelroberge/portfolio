const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding, deleteEmbedding, initCollection } = require("./qdrantService");
const { searchEntitiesHybrid } = require("./searchService");
const pdfParse = require("pdf-parse");
const counterService = require("./counterService");

const ALLOWED_TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".html", ".xml", ".yaml", ".yml"];

function getFileExtension(filename){
  return filename.split(".").pop().toLowerCase();
}
function isTextBasedFile(filename) {
  const ext = getFileExtension(filename);
    return ALLOWED_TEXT_EXTENSIONS.includes(`.${ext}`);
}

const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

/**
 * Upload a file to GridFS and process embeddings if applicable.
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
        size,
      },
    });

    req.pipe(uploadStream);

    uploadStream.on("finish", async (file) => {
      // Generate vectorId for new files
      const vectorId = await counterService.getNextVectorId();
      await updateFileMetadata(file._id, { vectorId });

      // Process embeddings for text-based files
      if (contentType.startsWith("text/") || contentType === "application/pdf") {
        await updateFileEmbeddings(file._id, filename, contentType);
      }
      resolve({ message: "File uploaded successfully", filename });
    });

    uploadStream.on("error", (err) => reject(err));
  });
}

/**
 * Extract text content from a file for embedding processing.
 */
async function extractFileText(fileId, ext) {
  try {
    const downloadStream = gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (ext === "pdf") {
      const pdfData = await pdfParse(fileBuffer);
      return pdfData.text;
    }
    return fileBuffer.toString("utf8");
  } catch (error) {
    console.error(`❌ Error extracting text from file ID: ${fileId}`, error);
    return "";
  }
}

/**
 * Generate embeddings for a stored file in GridFS.
 */
async function updateFileEmbeddings(fileId, filename, contentType) {
  const ext = getFileExtension(filename);
  const text = await extractFileText(fileId, ext);
  if (!text) return;

  const embedding = await generateEmbeddings(text);
  if (!embedding) throw new Error(`Failed to generate embedding for file: ${fileId}`);

  const fileMetadata = await getFileMetadata(fileId);
  await storeEmbedding("files", fileMetadata.vectorId, embedding, { filename });
}

/**
 * Get file metadata by ID.
 */
async function getFileMetadata(id) {
  return await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) });
}

/**
 * Serve public files.
 */
async function getPublicFile(id) {
  const file = await getFileMetadata(id);
  if (!file || !file.metadata.isPublic) return null;
  return gridFSBucket.openDownloadStream(file._id);
}

/**
 * Serve private files (Admins Only).
 */
async function getPrivateFile(id) {
  const file = await getFileMetadata(id);
  if (!file) return null;
  return gridFSBucket.openDownloadStream(file._id);
}

/**
 * Delete a file and remove its embedding.
 */
async function deleteFile(id) {
  try {
    await gridFSBucket.delete(new mongoose.Types.ObjectId(id));
    await deleteEmbedding("files", id.toString());
    return true;
  } catch (error) {
    console.error(`❌ Error deleting file ID: ${id}`, error);
    return false;
  }
}

/**
 * Get files by entity reference & context.
 */
async function getFilesByContext(entityId, context) {
  return await gfs.files.find({ "metadata.entityId": entityId, "metadata.context": context }).toArray();
}

/**
 * Retrieve all file metadata, filtering out media files.
 */
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
      metadata: file.metadata
    }));
}

/**
 * Search files using hybrid search (full-text + vector).
 */
async function searchFiles(query) {
  return searchEntitiesHybrid(gfs.files, query);
}

async function updateFileMetadata(fileId, metadata) {
  const db = mongoose.connection.db;
  const bucketFiles = db.collection("uploads.files"); // GridFS files collection

  try {
      const result = await bucketFiles.updateOne(
          { _id: new mongoose.Types.ObjectId(fileId) },
          { $set: { metadata: metadata } }  // ✅ Updates metadata
      );

      if (result.matchedCount === 0) {
          throw new Error(`File with ID ${fileId} not found`);
      }

      console.log(`✅ Updated metadata for file: ${fileId}`);
  } catch (error) {
      console.error(`❌ Error updating file metadata:`, error.message);
  }
}

async function ensureFileVectorId(fileId) {
  const db = mongoose.connection.db;
  const bucketFiles = db.collection("uploads.files"); // GridFS metadata collection

  const file = await bucketFiles.findOne({ _id: new mongoose.Types.ObjectId(fileId) });
  if (!file) {
      console.error(`❌ File with ID ${fileId} not found`);
      return;
  }

  if (!file.metadata || !file.metadata.vectorId) {
      console.log(`🔄 Assigning vectorId for file: ${file.filename}`);
      const vectorId = await counterService.getNextVectorId("file_vectorid");

      await updateFileMetadata(fileId, {
          ...file.metadata,  // Preserve existing metadata
          vectorId: vectorId
      });

      console.log(`✅ Assigned vectorId: ${vectorId} to file: ${file.filename}`);
      return vectorId;
  }

  return file.metadata.vectorId; // Return existing vectorId if already set
}

/**
 * Initializes embeddings for files stored in GridFS.
 */
async function initializeFileEmbeddings() {
  const collectionName = "uploads"; // GridFS bucket name
  console.log(`🔄 Initializing embeddings for "${collectionName}"...`);

  // 1️⃣ Ensure Qdrant collection exists
  await initCollection(collectionName);

  // 2️⃣ Fetch all files from GridFS
  const files = await gfs.files.find().toArray();
  if (!files.length) {
      console.log(`⚠️ No files found in "${collectionName}", skipping.`);
      return;
  }

  // 3️⃣ Generate & Store Embeddings for text-based files
  for (const file of files) {

      if (!file.metadata || !file.metadata.contentType) continue;

      if (!isTextBasedFile(file.filename)) {
        console.log(`⚠️ Skipping non-text file: ${file.filename}`);
        return;
    }

    const ext = getFileExtension(file.filename);

      const text = await extractFileText(file._id, ext);
      if (!text.trim()) continue;

      const embedding = await generateEmbeddings(text);
      if (!embedding) {
          console.error(`❌ Failed to generate embedding for file: ${file._id}`);
          continue;
      }

      const vectorId = await ensureFileVectorId(file._id);
      await storeEmbedding(collectionName, vectorId, embedding, {
          filename: file.filename,
          contentType: file.metadata.contentType,
      });

      console.log(`✅ Stored embedding for "${collectionName}" -> ${file.filename}`);
  }
}

module.exports = {
  uploadFile,
  getFileMetadata,
  getPublicFile,
  getPrivateFile,
  deleteFile,
  getFilesByContext,
  getAllFiles,
  searchFiles,
  initializeFileEmbeddings
};
