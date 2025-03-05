// Telemetry first
require('./tracing');
// The rest.
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}.local` });

console.log(`✅ Loaded environment: .env.${process.env.NODE_ENV}.local`);

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
const userRoutes = require("./routes/userRoutes");
const providerConfigRoutes = require("./routes/providerConfigRoutes");
const searchRoutes = require("./routes/searchRoutes");
const chatRoutes = require("./routes/chatRoutes");
const embeddingRoutes = require("./routes/embeddingRoutes");
const promptRoutes = require("./routes/promptRoutes");

const { prepopulateDefaultConfigs } = require("./services/providerConfigService");
const { initCollection } = require("./services/qdrantService");
const metricsMiddleware = require("./middlewares/metrics");

const { swaggerMiddleware, swaggerSetup } = require('./config/swagger');

const { dropCollection } = require('./services/qdrantService');

async function createApp() {
  // Connect to the database
  await connectDB();

  try{

    // await dropCollection();
    await initCollection();
  }
  catch(err){
    console.error("Cannot initialize collections", err);
  }
  // default configuration population
  await prepopulateDefaultConfigs();

  const app = express();

  app.use(cors({
    origin: process.env.ALLOW_CORS || "http://localhost:3000",
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
  app.use('/api/docs', swaggerMiddleware, swaggerSetup);
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/oauth2", oauthRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/provider-configs", providerConfigRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/embeddings", embeddingRoutes);
  app.use("/api/prompts", promptRoutes);

  return app;
}

module.exports = { createApp };
