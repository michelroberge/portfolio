# Environment Rules

## Quick Reference
**When to use**: Configuration management, environment variables, deployment settings, and environment-specific behavior

## Core Rules

### 🔧 **Environment Configuration**

#### Environment Variable Structure
```javascript
// ✅ Good - Environment configuration with defaults
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}.local` });

// ✅ Good - Environment-specific configuration
const config = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || "portfolio",
  
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Authentication
  SECRET_KEY: process.env.SECRET_KEY || "your_secret_key",
  SESSION_SECRET: process.env.SESSION_SECRET || "default-session-secret",
  
  // CORS
  ALLOW_CORS: process.env.ALLOW_CORS || "http://localhost:3000",
  
  // Logging
  LOG_HTTP_REQUESTS: process.env.LOG_HTTP_REQUESTS === "true",
  
  // External Services
  OLLAMA_API_URL: process.env.OLLAMA_API_URL || "http://localhost:11434",
  PROMPT_MODEL: process.env.PROMPT_MODEL || "mistral:7b",
  MODEL_TEMPERATURE: process.env.MODEL_TEMPERATURE || 0.4,
  
  // Vector Database
  QDRANT_URL: process.env.QDRANT_URL || "http://localhost:6333",
  QDRANT_API_KEY: process.env.QDRANT_API_KEY || "",
  VECTOR_SIZE: parseInt(process.env.VECTOR_SIZE, 10) || 4096,
  
  // OIDC Configuration
  OIDC_ISSUER: process.env.OIDC_ISSUER,
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
  OIDC_REDIRECT_URI: process.env.OIDC_REDIRECT_URI,
  
  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
};

module.exports = config;
```

#### Frontend Environment Configuration
```typescript
// ✅ Good - Frontend environment variables
export const ENV_CONFIG = {
  // API URLs
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000",
  
  // Base Path
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "",
  
  // OIDC Configuration
  NEXT_OIDC_CLIENT_ID: process.env.NEXT_OIDC_CLIENT_ID,
  NEXT_OIDC_ISSUER: process.env.NEXT_OIDC_ISSUER,
  NEXT_OIDC_REDIRECT_URI: process.env.NEXT_OIDC_REDIRECT_URI,
  
  // Feature Flags
  NEXT_LOCAL_AUTH_DISABLE: process.env.NEXT_LOCAL_AUTH_DISABLE === "true",
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// ✅ Good - Environment validation
export function validateEnvironment() {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}
```

### 🏗️ **Configuration Management**

#### Service Configuration
```javascript
// ✅ Good - Service-specific configuration
const OLLAMA_CONFIG = {
  API_URL: process.env.OLLAMA_API_URL || "http://localhost:11434",
  MODEL: process.env.PROMPT_MODEL || "mistral:7b",
  TEMPERATURE: parseFloat(process.env.MODEL_TEMPERATURE) || 0.4,
  MAX_TOKENS: parseInt(process.env.MAX_TOKENS) || 200,
};

const QDRANT_CONFIG = {
  URL: process.env.QDRANT_URL || "http://localhost:6333",
  API_KEY: process.env.QDRANT_API_KEY || "",
  VECTOR_SIZE: parseInt(process.env.VECTOR_SIZE, 10) || 4096,
  COLLECTION_PREFIX: process.env.COLLECTION_PREFIX || "portfolio",
};

const EMBEDDING_CONFIG = {
  SERVICE: process.env.EMBEDDING_SERVICE?.toLowerCase() || "ollama",
  MODEL: process.env.EMBEDDING_MODEL || "mistral:7b",
  VECTOR_SIZE: parseInt(process.env.VECTOR_SIZE, 10) || 4096,
};

// ✅ Good - Configuration validation
function validateConfig() {
  const errors = [];

  if (!process.env.MONGODB_URI) {
    errors.push("MONGODB_URI is required");
  }

  if (process.env.NODE_ENV === "production") {
    if (!process.env.SECRET_KEY || process.env.SECRET_KEY === "your_secret_key") {
      errors.push("SECRET_KEY must be set in production");
    }
    
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === "default-session-secret") {
      errors.push("SESSION_SECRET must be set in production");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }
}
```

#### Environment-Specific Behavior
```javascript
// ✅ Good - Environment-specific middleware
if (process.env.LOG_HTTP_REQUESTS === "true") {
  app.use(requestLogger);
} else {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ✅ Good - CORS configuration
if (process.env.ALLOW_CORS) {
  app.use(cors({
    origin: process.env.ALLOW_CORS || "http://localhost:3000",
    credentials: true,
  }));
}

// ✅ Good - Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "default-session-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongooseConnection.getClient(),
    dbName: process.env.MONGO_DB_NAME || "sessiondb",
    collectionName: "sessions",
    ttl: 60 * 60 * 24, // 1 day in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
  },
  name: "sessionId",
};
```

### 🐳 **Docker Configuration**

#### Dockerfile Configuration
```dockerfile
# ✅ Good - Multi-stage Docker build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["node", "dist/server.js"]
```

#### Docker Compose Configuration
```yaml
# ✅ Good - Docker Compose with environment variables
version: '3.8'

services:
  backend:
    build: ./portfolio.node
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/portfolio
      - SECRET_KEY=${SECRET_KEY}
      - SESSION_SECRET=${SESSION_SECRET}
      - OLLAMA_API_URL=http://ollama:11434
      - QDRANT_URL=http://qdrant:6333
    depends_on:
      - mongo
      - ollama
      - qdrant
    volumes:
      - ./logs:/app/logs

  frontend:
    build: ./portfolio.next
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
      - NEXT_PUBLIC_WS_URL=ws://localhost:5000
    depends_on:
      - backend

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=portfolio

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  mongo_data:
  ollama_data:
  qdrant_data:
```

### 🔐 **Security Configuration**

#### Environment Variable Security
```javascript
// ✅ Good - Secure environment variable handling
const requiredEnvVars = [
  'MONGODB_URI',
  'SECRET_KEY',
  'SESSION_SECRET',
];

const optionalEnvVars = [
  'OLLAMA_API_URL',
  'QDRANT_URL',
  'OIDC_ISSUER',
  'OIDC_CLIENT_ID',
  'OIDC_CLIENT_SECRET',
];

// Validate required environment variables
function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate production requirements
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SECRET_KEY === 'your_secret_key') {
      throw new Error('SECRET_KEY must be changed from default in production');
    }
    
    if (process.env.SESSION_SECRET === 'default-session-secret') {
      throw new Error('SESSION_SECRET must be changed from default in production');
    }
  }
}

// ✅ Good - Environment variable sanitization
function sanitizeEnvVar(value, defaultValue = '') {
  if (!value || typeof value !== 'string') {
    return defaultValue;
  }
  
  // Remove any potential script injection
  return value.replace(/[<>]/g, '').trim();
}

const config = {
  MONGODB_URI: sanitizeEnvVar(process.env.MONGODB_URI),
  SECRET_KEY: sanitizeEnvVar(process.env.SECRET_KEY, 'your_secret_key'),
  SESSION_SECRET: sanitizeEnvVar(process.env.SESSION_SECRET, 'default-session-secret'),
  OLLAMA_API_URL: sanitizeEnvVar(process.env.OLLAMA_API_URL, 'http://localhost:11434'),
};
```

### 🚀 **Deployment Configuration**

#### Production Configuration
```javascript
// ✅ Good - Production-specific configuration
const productionConfig = {
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || "https://yourdomain.com",
  COOKIE_SECURE: true,
  COOKIE_SAME_SITE: "Strict",
  
  // Performance
  COMPRESSION_ENABLED: true,
  CACHE_CONTROL: "public, max-age=31536000",
  
  // Monitoring
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  METRICS_ENABLED: true,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Database
  MONGODB_OPTIONS: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

// ✅ Good - Development configuration
const developmentConfig = {
  // Security
  CORS_ORIGIN: "http://localhost:3000",
  COOKIE_SECURE: false,
  COOKIE_SAME_SITE: "Lax",
  
  // Performance
  COMPRESSION_ENABLED: false,
  CACHE_CONTROL: "no-cache",
  
  // Monitoring
  LOG_LEVEL: "debug",
  METRICS_ENABLED: false,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 1000,
  
  // Database
  MONGODB_OPTIONS: {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

const config = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
```

### 📝 **Environment File Templates**

#### .env.example
```bash
# ✅ Good - Environment file template
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio
MONGO_DB_NAME=portfolio

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
SECRET_KEY=your_secret_key_here
SESSION_SECRET=your_session_secret_here

# CORS
ALLOW_CORS=http://localhost:3000

# Logging
LOG_HTTP_REQUESTS=true

# External Services
OLLAMA_API_URL=http://localhost:11434
PROMPT_MODEL=mistral:7b
MODEL_TEMPERATURE=0.4

# Vector Database
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
VECTOR_SIZE=4096

# OIDC Configuration (Optional)
OIDC_ISSUER=
OIDC_CLIENT_ID=
OIDC_CLIENT_SECRET=
OIDC_REDIRECT_URI=

# Frontend URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Feature Flags
NEXT_LOCAL_AUTH_DISABLE=false
```

#### .env.production
```bash
# ✅ Good - Production environment file
# Database Configuration
MONGODB_URI=mongodb://mongo:27017/portfolio
MONGO_DB_NAME=portfolio

# Server Configuration
PORT=5000
NODE_ENV=production

# Security (MUST be changed in production)
SECRET_KEY=your_secure_secret_key_here
SESSION_SECRET=your_secure_session_secret_here

# CORS
ALLOW_CORS=https://yourdomain.com

# Logging
LOG_HTTP_REQUESTS=true

# External Services
OLLAMA_API_URL=http://ollama:11434
PROMPT_MODEL=mistral:7b
MODEL_TEMPERATURE=0.4

# Vector Database
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=your_qdrant_api_key
VECTOR_SIZE=4096

# OIDC Configuration
OIDC_ISSUER=https://your-oidc-provider.com
OIDC_CLIENT_ID=your_client_id
OIDC_CLIENT_SECRET=your_client_secret
OIDC_REDIRECT_URI=https://yourdomain.com/api/auth/oidc/callback

# Frontend URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Feature Flags
NEXT_LOCAL_AUTH_DISABLE=true
```

### 🔄 **Configuration Validation**

#### Environment Validation
```typescript
// ✅ Good - Environment validation utility
export function validateEnvironmentConfig() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  const required = {
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
  };

  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      errors.push(`${key} is required`);
    }
  });

  // Production-specific validation
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SECRET_KEY === 'your_secret_key') {
      errors.push('SECRET_KEY must be changed from default in production');
    }
    
    if (process.env.SESSION_SECRET === 'default-session-secret') {
      errors.push('SESSION_SECRET must be changed from default in production');
    }
    
    if (!process.env.ALLOW_CORS?.includes('https://')) {
      warnings.push('CORS should use HTTPS in production');
    }
  }

  // URL validation
  const urls = {
    MONGODB_URI: process.env.MONGODB_URI,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    QDRANT_URL: process.env.QDRANT_URL,
  };

  Object.entries(urls).forEach(([key, url]) => {
    if (url && !isValidUrl(url)) {
      warnings.push(`${key} may not be a valid URL: ${url}`);
    }
  });

  return { errors, warnings };
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
```

## Common Patterns

### 🔄 **Configuration Loading**
```javascript
// ✅ Good - Configuration loading with validation
function loadConfiguration() {
  // Load environment-specific config
  const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;
  require("dotenv").config({ path: envFile });

  // Validate configuration
  validateEnvironment();

  // Return configuration object
  return {
    database: {
      uri: process.env.MONGODB_URI,
      name: process.env.MONGO_DB_NAME,
    },
    server: {
      port: parseInt(process.env.PORT) || 5000,
      env: process.env.NODE_ENV || 'development',
    },
    security: {
      secretKey: process.env.SECRET_KEY,
      sessionSecret: process.env.SESSION_SECRET,
    },
    services: {
      ollama: {
        url: process.env.OLLAMA_API_URL,
        model: process.env.PROMPT_MODEL,
        temperature: parseFloat(process.env.MODEL_TEMPERATURE) || 0.4,
      },
      qdrant: {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        vectorSize: parseInt(process.env.VECTOR_SIZE) || 4096,
      },
    },
  };
}
```

### 🔄 **Feature Flags**
```typescript
// ✅ Good - Feature flag configuration
export const FEATURE_FLAGS = {
  LOCAL_AUTH_ENABLED: process.env.NEXT_LOCAL_AUTH_DISABLE !== 'true',
  OIDC_ENABLED: !!(process.env.NEXT_OIDC_CLIENT_ID && process.env.NEXT_OIDC_ISSUER),
  ANALYTICS_ENABLED: process.env.NODE_ENV === 'production',
  DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

// ✅ Good - Feature flag hook
export function useFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}
```

## Quick Checklist

- [ ] **Environment variables** are properly structured and documented
- [ ] **Configuration validation** is implemented
- [ ] **Security** considerations are addressed
- [ ] **Environment-specific** behavior is configured
- [ ] **Docker configuration** is optimized
- [ ] **Production settings** are secure
- [ ] **Feature flags** are implemented
- [ ] **Error handling** for missing variables
- [ ] **Documentation** is provided for all variables
- [ ] **Validation** catches configuration errors

## Cross-References

- [Backend Rules](backend-rules.md) - Express configuration patterns
- [Frontend Rules](frontend-rules.md) - Next.js configuration patterns
- [Deployment Rules](deployment-rules.md) - Deployment configuration patterns

---

*Follow these environment rules to create secure, maintainable, and deployable applications.*
