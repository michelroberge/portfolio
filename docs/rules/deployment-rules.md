# Deployment Rules

## Quick Reference
**When to use**: Docker deployment, CI/CD pipelines, production deployment, and infrastructure management

## Core Rules

### 🐳 **Docker Deployment**

#### Multi-stage Dockerfile
```dockerfile
# ✅ Good - Frontend Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# ✅ Good - Production Docker Compose
version: '3.8'
services:
  backend:
    build: ./portfolio.node
    ports: ["5000:5000"]
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/portfolio
    depends_on: [mongo, ollama, qdrant]
    restart: unless-stopped

  frontend:
    build: ./portfolio.next
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on: [backend]
    restart: unless-stopped

  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]
    restart: unless-stopped

volumes:
  mongo_data:
```

### 🔄 **CI/CD Pipeline**

#### GitHub Actions
```yaml
# ✅ Good - CI/CD pipeline
name: Deploy Portfolio

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: |
          docker build -t portfolio-backend ./portfolio.node
          docker build -t portfolio-frontend ./portfolio.next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### 🚀 **Production Deployment**

#### Environment Configuration
```bash
# ✅ Good - Production environment
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/portfolio
SECRET_KEY=your_secure_secret_key
SESSION_SECRET=your_secure_session_secret
ALLOW_CORS=https://yourdomain.com
OLLAMA_API_URL=http://ollama:11434
QDRANT_URL=http://qdrant:6333
```

#### Health Checks
```javascript
// ✅ Good - Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### 🔒 **Security Deployment**

#### Production Security
```javascript
// ✅ Good - Production security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }));
}
```

### 📊 **Monitoring & Logging**

#### Production Logging
```javascript
// ✅ Good - Production logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Quick Checklist

- [ ] **Docker images** are optimized and secure
- [ ] **Environment variables** are properly configured
- [ ] **Health checks** are implemented
- [ ] **Security headers** are set
- [ ] **Rate limiting** is configured
- [ ] **Logging** is comprehensive
- [ ] **Monitoring** is in place
- [ ] **Backup strategy** is defined
- [ ] **Rollback plan** is ready
- [ ] **SSL/TLS** is configured

## Cross-References

- [Environment Rules](environment-rules.md) - Environment configuration
- [Security Rules](security-rules.md) - Security best practices
- [Backend Rules](backend-rules.md) - Express deployment patterns

---

*Follow these deployment rules to create secure, scalable, and maintainable production deployments.*
