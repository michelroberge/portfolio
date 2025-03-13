/**
 * Admin Routes Index
 * Following Domain Driven Design and Clean Architecture principles
 */

const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require("../../middlewares/admin");

const blogRoutes = require("./blogRoutes");
const projectRoutes = require("./projectRoutes");
const userRoutes = require("../../routes/userRoutes");
const providerConfigRoutes = require("../../routes/providerConfigRoutes");
const careerRoutes = require("../../routes/careerTimelineRoutes");
const pageRoutes = require("../../routes/pageRoutes");

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminAuth);

// Mount admin-specific routes
router.use("/blogs", blogRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/provider-configs", providerConfigRoutes);
router.use("/career", careerRoutes);
router.use("/pages", pageRoutes);

module.exports = router;
