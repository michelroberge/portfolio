/**
 * Admin Routes Index
 * Following Domain Driven Design and Clean Architecture principles
 */

const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/admin");

const blogRoutes = require("./blogRoutes");
const projectRoutes = require("./projectRoutes");
const userRoutes = require("./userRoutes");
const providerConfigRoutes = require("./providerConfigRoutes");
const pageRoutes = require("./pageRoutes");
const aiRoutes = require("./aiRoutes");
const careerTimelineRoutes = require("./careerTimelineRoutes");
const promptRoutes = require("./promptRoutes");
const commentRoutes = require("./commentRoutes");
const fileRoutes = require("./fileRoutes");
const embeddingRoutes = require("./embeddings/index.js");
const chatbotHistoryRoutes = require("./chatbotHistoryRoutes");

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminAuth);

// Mount admin-specific routes
router.use("/files", fileRoutes);
router.use("/blogs", blogRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/provider-configs", providerConfigRoutes);
router.use("/pages", pageRoutes);
router.use("/ai", aiRoutes);
router.use("/career", careerTimelineRoutes);
router.use("/prompts", promptRoutes);
router.use("/comments", commentRoutes);
router.use("/embeddings", embeddingRoutes);
router.use("/chatbot-history", chatbotHistoryRoutes);

module.exports = router;
