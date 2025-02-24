// Telemetry first
require('./tracing');
// The rest.
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const { passport, setupStrategies } = require("./config/passport");


const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const commentRoutes = require("./routes/commentRoutes");
const providerConfigRoutes = require("./routes/providerConfigRoutes"); // NEW

const { prepopulateDefaultConfigs } = require("./services/providerConfigService");

const metricsMiddleware = require("./middlewares/metrics");

async function createApp() {
  // Connect to the database
  await connectDB();

  // default configuration population
  await prepopulateDefaultConfigs();

  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(metricsMiddleware);
 
setupStrategies()
  .then(() => {
    console.log("Passport strategies initialized successfully.");
    // Start your Express server here...
  })
  .catch((err) => {
    console.error("Error initializing passport strategies:", err);
  });

  app.use(passport.initialize());

  // Set up routes
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/oauth2", oauthRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/provider-configs", providerConfigRoutes);

  return app;
}

module.exports = { createApp };
