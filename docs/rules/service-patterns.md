# Service Patterns

## Quick Reference
**When to use**: Organizing business logic, API calls, data processing, and external integrations

## Core Rules

### 🏗️ **Service Layer Architecture**

#### Frontend Service Pattern
```typescript
// ✅ Good - Typed service functions
import { PUBLIC_API, ADMIN_API } from '@/lib/constants';
import { ServiceType, ServiceError } from '@/models/Service';

const SERVICE_ERRORS = {
  FETCH_FAILED: "Failed to fetch data",
  NETWORK_ERROR: "Network error occurred",
  UNAUTHORIZED: "Unauthorized access",
} as const;

export async function fetchServiceData(id: string): Promise<ServiceType> {
  try {
    const res = await fetch(PUBLIC_API.service.get(id), {
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json() as ServiceError;
      if (res.status === 401) {
        throw new Error(SERVICE_ERRORS.UNAUTHORIZED);
      }
      throw new Error(error.message || SERVICE_ERRORS.FETCH_FAILED);
    }

    return res.json();
  } catch (error) {
    console.error("Service error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(SERVICE_ERRORS.NETWORK_ERROR);
  }
}
```

#### Backend Service Pattern
```javascript
// ✅ Good - Service with proper error handling
const Model = require("../models/Model");
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding } = require("./qdrantService");

/**
 * Create a new entity and store its embedding.
 * @param {Object} data - Entity data
 * @returns {Promise<Object>} Created entity
 */
async function createEntity(data) {
  try {
    const entity = new Model(data);
    await entity.save();

    // Generate and store embeddings
    await updateEntityEmbeddings(entity);

    return entity;
  } catch (error) {
    console.error("❌ Entity creation error:", error);
    throw new Error("Failed to create entity");
  }
}

/**
 * Update entity embeddings in vector store
 * @param {Object} entity - Entity to update
 */
async function updateEntityEmbeddings(entity) {
  try {
    const embedding = await generateEmbeddings(entity.content);
    await storeEmbedding(entity.collection, entity._id, embedding, entity);
  } catch (error) {
    console.error("❌ Embedding update error:", error);
    // Don't throw - embedding failure shouldn't break entity creation
  }
}
```

### 🔄 **Data Flow Patterns**

#### CRUD Operations
```typescript
// ✅ Good - Complete CRUD service
export class EntityService {
  static async create(data: CreateEntityData): Promise<Entity> {
    const res = await fetch(ADMIN_API.entity.create, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error("Failed to create entity");
    return res.json();
  }

  static async read(id: string): Promise<Entity> {
    const res = await fetch(PUBLIC_API.entity.get(id), {
      credentials: "include",
    });
    
    if (!res.ok) throw new Error("Failed to fetch entity");
    return res.json();
  }

  static async update(id: string, data: UpdateEntityData): Promise<Entity> {
    const res = await fetch(ADMIN_API.entity.update(id), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error("Failed to update entity");
    return res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(ADMIN_API.entity.delete(id), {
      method: "DELETE",
      credentials: "include",
    });
    
    if (!res.ok) throw new Error("Failed to delete entity");
  }
}
```

#### Pipeline Services
```javascript
// ✅ Good - Pipeline service for complex operations
async function executePipeline(promptName, parameters, isStreaming = false, streamCallback = null) {
  try {
    // Step 1: Detect Intent
    const intentResponse = await queryLLMByName("intent-detection", { 
      userQuery: parameters.userQuery 
    }, false);
    const intent = intentResponse?.intent || "general_knowledge";

    // Step 2: Generate Query Vector
    parameters.queryVector = await generateEmbeddings(parameters.userQuery);

    // Step 3: Fetch Relevant Data
    parameters.context = await fetchRelevantData(parameters, intent);

    // Step 4: Execute AI Query
    const responseStream = await queryLLMByName(promptName, parameters, true);
    
    // Handle streaming response
    if (isStreaming && streamCallback) {
      // Stream processing logic
    }

    return { response: "Pipeline completed successfully" };
  } catch (error) {
    console.error("❌ Pipeline execution error:", error);
    if (isStreaming && streamCallback) {
      streamCallback({ response: `❌ Error: ${error.message}` });
    }
    return { response: "An error occurred while processing your request." };
  }
}
```

### 🔐 **Authentication Services**

#### OIDC Integration
```javascript
// ✅ Good - OIDC service with caching
let oidcConfig = null;
let oidcConfigExpiry = 0;

async function getOIDCConfig() {
  const now = Date.now();
  if (oidcConfig && now < oidcConfigExpiry) {
    return oidcConfig;
  }

  try {
    const wellKnownUrl = `${process.env.OIDC_ISSUER}/.well-known/openid-configuration`;
    const response = await fetch(wellKnownUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch OIDC config: ${response.status}`);
    }
    
    oidcConfig = await response.json();
    oidcConfigExpiry = now + (5 * 60 * 1000); // Cache for 5 minutes
    return oidcConfig;
  } catch (error) {
    console.error('Failed to fetch OIDC configuration:', error);
    throw error;
  }
}
```

#### JWT Token Management
```javascript
// ✅ Good - JWT service with proper validation
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
```

### 🗄️ **Database Services**

#### Mongoose Model Services
```javascript
// ✅ Good - Model service with validation
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function createUser({ username, password, isAdmin = false }) {
  try {
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    // Create new user
    const user = new User({ username, passwordHash: password, isAdmin });
    await user.save();
    return user;
  } catch (error) {
    console.error('User creation failed:', error.message);
    throw error;
  }
}

async function validateUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error("Invalid credentials");
  }
  return user;
}
```

#### Vector Database Services
```javascript
// ✅ Good - Qdrant vector service
const { QdrantClient } = require("@qdrant/js-client-rest");

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY || "",
});

async function storeEmbedding(collection, id, vector, payload) {
  try {
    await qdrantClient.upsert(collection, {
      points: [{
        id: id,
        vector: vector,
        payload: payload
      }]
    });
  } catch (error) {
    console.error("❌ Vector storage error:", error);
    throw new Error("Failed to store embedding");
  }
}

async function searchVectors(collection, queryVector, limit = 10) {
  try {
    const results = await qdrantClient.search(collection, {
      vector: queryVector,
      limit: limit
    });
    return results;
  } catch (error) {
    console.error("❌ Vector search error:", error);
    throw new Error("Failed to search vectors");
  }
}
```

### 🔄 **External API Services**

#### LLM Service Integration
```javascript
// ✅ Good - LLM service with fallbacks
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const PROMPT_MODEL = process.env.PROMPT_MODEL || "mistral:7b";

async function generateResponse(prompt) {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: PROMPT_MODEL,
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.4,
        format: 'json',
      }),
    });

    if (!response.ok) {
      console.error(`⚠️ API returned an error: ${response.statusText}`);
      return { response: "I'm having trouble generating a response right now. Try again later." };
    }

    // Process streaming response
    const reader = response.body.getReader();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullResponse += parsed.response;
            }
          } catch (err) {
            console.warn("Skipping invalid JSON chunk");
          }
        }
      });
    }

    return { response: fullResponse.trim() || "No response generated." };
  } catch (error) {
    console.error("Error communicating with LLM:", error);
    return { response: "I'm having trouble generating a response right now. Try again later." };
  }
}
```

### 📊 **Analytics Services**

#### Event Tracking
```typescript
// ✅ Good - Analytics service with error handling
export async function trackEvent(event: string, data?: Record<string, any>): Promise<void> {
  try {
    const res = await fetch(ADMIN_API.analytics.trackEvent, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, data }),
    });

    if (!res.ok) {
      const error = await res.json();
      if (res.status === 401) {
        throw new Error("Unauthorized access to analytics");
      }
      throw new Error(error.message || "Failed to track analytics");
    }
  } catch (error) {
    console.error("Analytics service error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while tracking analytics");
  }
}
```

## Common Patterns

### 🔄 **Cache Management**
```javascript
// ✅ Good - Service with caching
const cache = require("../utils/cache");

async function getCachedData(key, fetchFunction, ttl = 300) {
  let data = cache.get(key);
  
  if (!data) {
    data = await fetchFunction();
    cache.set(key, data, ttl);
  }
  
  return data;
}
```

### 🔄 **Retry Logic**
```javascript
// ✅ Good - Service with retry mechanism
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}
```

### 🔄 **Batch Operations**
```javascript
// ✅ Good - Batch processing service
async function processBatch(items, processFunction, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processFunction(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}
```

## Quick Checklist

- [ ] **Service structure** follows established patterns
- [ ] **Error handling** is comprehensive with proper logging
- [ ] **Type safety** is maintained (TypeScript frontend)
- [ ] **Authentication** is properly integrated
- [ ] **Caching** is implemented where appropriate
- [ ] **Retry logic** is included for external APIs
- [ ] **Validation** is performed on inputs
- [ ] **Logging** is consistent and informative
- [ ] **Documentation** includes JSDoc comments
- [ ] **Testing** covers critical paths

## Cross-References

- [Backend Rules](backend-rules.md) - Express and MongoDB patterns
- [API Rules](api-rules.md) - REST endpoint patterns
- [Error Handling](error-handling.md) - Error management patterns

---

*Follow these service patterns to create robust, maintainable business logic.*
