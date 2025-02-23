// portfolio.node/src/app.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const commentRoutes = require("./routes/commentRoutes");

async function createApp() {
  // Connect to the database
  await connectDB();

  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Set up routes
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/oauth2", oauthRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/comments", commentRoutes);

  return app;
}

module.exports = { createApp };
