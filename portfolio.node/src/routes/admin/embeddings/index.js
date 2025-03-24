const express = require("express");

const collectionRoutes = require("./collections");
const documentRoutes = require("./documents");
const embeddingRoutes = require("./embeddingRoutes");

const router = express.Router();

router.use("/", embeddingRoutes);
router.use("/collection", collectionRoutes);
router.use("/document", documentRoutes);

module.exports = router;