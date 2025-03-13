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
const { warmupLLM } = require("./services/warmUpService");

const requestLogger = require("./middlewares/requestLogger");

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
const fileRoutes = require("./routes/fileRoutes");
const careerTimelineRoutes = require("./routes/careerTimelineRoutes");
const pageRoutes = require("./routes/pageRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { prepopulateDefaultConfigs } = require("./services/providerConfigService");
const metricsMiddleware = require("./middlewares/metrics");

const { swaggerMiddleware, swaggerSetup } = require('./config/swagger');

const adminRoutes = require("./routes/admin");

async function createApp() {
  // Connect to the database
  await connectDB();

  // default configuration population
  await prepopulateDefaultConfigs();

  const app = express();
  
  if ( process.env.ALLOW_CORS){
    app.use(cors({
      origin: process.env.ALLOW_CORS || "http://localhost:3000",
      credentials: true, // Allow cookies to be sent
    }));
  }
  
  if ( process.env.LOG_HTTP_REQUESTS==="true"){
    app.use(requestLogger);
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
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

  // Swagger Documentation
  app.use('/api/docs', swaggerMiddleware, swaggerSetup);

  // Public Routes (no auth required)
  app.use("/api/blogs", blogRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/pages", pageRoutes);
  app.use("/api/career", careerTimelineRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/files", fileRoutes);

  // Authentication Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/oauth2", oauthRoutes);

  // Protected Routes (require authentication)
  app.use("/api/comments", commentRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/embeddings", embeddingRoutes);
  app.use("/api/prompts", promptRoutes);
  app.use("/api/ai", aiRoutes);

  // Admin Routes (require authentication and admin role)
  app.use("/api/admin", adminRoutes);

  // Warm-up LLM at startup
  warmupLLM().then(() => {
    console.log("🚀 Warm-up complete!");
  }).catch(err => {
    console.error("⚠️ Warm-up encountered an issue:", err);
  });
  
  return app;
}

module.exports = { createApp };
