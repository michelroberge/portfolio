# Backend Rules

## Quick Reference
**When to use**: Creating Express routes, MongoDB models, services, or backend middleware.

## Core Rules

### 1. Route Structure
```javascript
// ✅ Standard route file structure
const express = require("express");
const service = require("../services/service");
const middleware = require("../middlewares/middleware");

const router = express.Router();

// Public routes first
router.get("/", async (req, res) => {
  try {
    const data = await service.getData();
    res.json(data);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected routes
router.post("/", middleware.auth, async (req, res) => {
  // Implementation
});

module.exports = router;
```

### 2. Model Pattern
```javascript
// ✅ Mongoose model with pre/post hooks
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hooks for data transformation
Schema.pre('save', async function(next) {
  // Transform data before saving
  next();
});

// Post-find hooks for data enrichment
Schema.post('find', function(docs) {
  // Add computed properties
});

module.exports = mongoose.model("ModelName", Schema);
```

### 3. Service Layer Pattern
```javascript
// ✅ Business logic in services
class Service {
  async getAll(filter = {}) {
    try {
      return await Model.find(filter);
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }
  
  async create(data) {
    try {
      return await Model.create(data);
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }
}

module.exports = new Service();
```

### 4. Middleware Pattern
```javascript
// ✅ Authentication middleware
module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

## Folder Structure
```
src/
├── config/               # Configuration files
├── middlewares/          # Express middlewares
├── models/               # Mongoose models
├── routes/               # Express route handlers
│   └── admin/           # Admin-specific routes
├── services/             # Business logic services
├── utils/                # Utility functions
└── validators/           # Input validation schemas
```

## Common Patterns

### Error Handling
```javascript
// ✅ Route error handling
router.get("/", async (req, res) => {
  try {
    const data = await service.getData();
    res.json(data);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### Input Validation
```javascript
// ✅ Use Joi for validation
const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  isPublished: Joi.boolean().default(false)
});

router.post("/", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Continue with validated data
});
```

### Authentication Flow
```javascript
// ✅ JWT token verification
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
```

## API Response Format
```javascript
// ✅ Success response
{
  "data": [...],
  "message": "Success message"
}

// ✅ Error response
{
  "error": "Error message",
  "details": "Additional details"
}
```

## Security Rules
- Use HTTP-only cookies for JWT tokens
- Implement role-based access control (RBAC)
- Validate all inputs with Joi
- Sanitize data for public endpoints
- Use environment variables for secrets

## Performance Rules
- Use database indexing
- Implement query optimization
- Use caching with node-cache
- Implement connection pooling

## Quick Checklist
- [ ] Service layer used for business logic
- [ ] Proper error handling implemented
- [ ] Input validation with Joi
- [ ] Authentication middleware applied
- [ ] Environment variables used for config
- [ ] Database queries optimized
- [ ] Tests written for routes and services

---
*See [API Rules](api-rules.md) for endpoint patterns and [Security Rules](security-rules.md) for auth details* 