const qdrantService = require("./qdrantService");
const {getAllBlogEntries} = require("./blogService");
const {getAllProjects} = require("./projectService");
const {getAllPages} = require("./pageService");
const {getAllFiles, extractFileText} = require("./fileService");

const EMBEDDING_SERVICE = process.env.EMBEDDING_SERVICE?.toLowerCase() || "ollama"; // Default to Ollama
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "mistral"; // Default model for Ollama
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE, 10) || (EMBEDDING_SERVICE === "openai" ? 1536 : 4096);
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://10.0.0.42:11434";
const OPENAI_API_URL = "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure API key is set for OpenAI

async function generateEmbeddings(text) {
  if (EMBEDDING_SERVICE === "openai") {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in your .env file.");
    }
    return generateOpenAIEmbeddings(text);
  }
  return generateOllamaEmbeddings(text); // Default to Ollama
}

async function generateOllamaEmbeddings(text) {
  try {

    // console.log(`ollama endpoint`, `${OLLAMA_API_URL}/api/embeddings`);
    // console.log(`ollama payload`, 
    //   {model: EMBEDDING_MODEL, // Dynamically set from .env
    //   prompt: text,
    // });
    
    const response = await fetch(`${OLLAMA_API_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: EMBEDDING_MODEL, // Dynamically set from .env
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.embedding.length !== VECTOR_SIZE) {
      throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.embedding.length}`);
    }
    return data.embedding;
  } catch (error) {
    console.error("Error generating embeddings with Ollama:", error);
    throw new Error("Failed to generate embeddings with Ollama.");
  }
}

async function generateOpenAIEmbeddings(text) {
  try {
    const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002", // Ensure correct OpenAI model
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.data[0].embedding.length !== VECTOR_SIZE) {
      throw new Error(`Expected vector size ${VECTOR_SIZE}, but got ${data.data[0].embedding.length}`);
    }
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embeddings with OpenAI:", error);
    throw new Error("Failed to generate embeddings with OpenAI.");
  }
}

async function initializeEmbeddings() {
  console.log("Initializing embeddings...");

  // Step 1: Remove all collections in Qdrant

  // Step 2: Recreate collections
  const collections = ["pages", "blogs", "projects", "files"];
  for (const collection of collections) {
    await qdrantService.dropCollection(collection);
    await qdrantService.initCollection(collection);
    console.log(`Collection '${collection}' (re)created.`);
  }

  // Step 3: Generate embeddings for different entities
  await generateEmbeddingsForEntities("pages", getAllPages, formatPageForEmbedding);
  await generateEmbeddingsForEntities("blogs", getAllBlogEntries, formatBlogForEmbedding);
  if ( getAllProjects){
    await generateEmbeddingsForEntities("projects", getAllProjects, formatProjectForEmbedding);
  }else{
    console.log(`getAllProjects does not link...`);
  }
  await generateEmbeddingsForEntities("files", getAllFiles, formatFileForEmbedding);

  console.log("Embeddings initialization complete.");
}

async function defaultFormatter(entity){
  let content = entity.content || entity.description || entity.excerpt || "";
  if (collectionName === "files") {
    content = await extractFileText(entity);
  }
  else{
    content = entity.body || entity.content || entity.description || entity.excerpt || "";
  }
  return content;
}
async function generateEmbeddingsForEntities(collectionName, fetchFunction, formatFunction) {
  const entities = await fetchFunction();
  console.log(`generating ${entities.length} '${collectionName}' embeddings`);
  for (const entity of entities) {
    const metadata = {
      id: entity._id,
      title: entity.title,
      tags: entity.tags || [],
      type: collectionName,
    };

    // Extract content to embed
    let content = formatFunction ? await formatFunction(entity) : defaultFormatter(entity);

    if (!content) continue;

    // Generate embedding
    const embeddings = await generateEmbeddings(content);
    await qdrantService.storeEmbedding(collectionName, entity._id, embeddings, metadata);
  }
}

function formatBlogForEmbedding(blog) {
  return `
    Title: ${blog.title}
    Tags: ${blog.tags?.join(", ") || "None"}
    Published: ${new Date(blog.createdAt).toLocaleDateString()}
    
    ${blog.content}
  `.trim();
}

function formatProjectForEmbedding(project) {
  return `
    Project: ${project.title}
    Tags: ${project.tags?.join(", ") || "None"}
    Description: ${project.description || "No description available"}
    Link: ${project.link || "No link"}
  `.trim();
}

function formatPageForEmbedding(page) {
  return `
    Page Title: ${page.title}
    Tags: ${page.tags?.join(", ") || "None"}
    
    ${page.content}
  `.trim();
}

async function formatFileForEmbedding(file) {
  return await extractFileText(file);
}



module.exports = {
  generateEmbeddings,
  initializeEmbeddings 
};
