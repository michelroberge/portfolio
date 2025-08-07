# API Rules

## Quick Reference
**When to use**: Designing REST endpoints, authentication flows, or API responses.

## RESTful Endpoint Structure

### Public APIs (No Auth Required)
```
GET    /api/blogs          # List all published blogs
GET    /api/blogs/:id      # Get single blog
GET    /api/projects       # List all projects
GET    /api/projects/:id   # Get single project
GET    /api/search         # Search functionality
```

### Protected APIs (Auth Required)
```
POST   /api/comments       # Create comment
PUT    /api/comments/:id   # Update comment
DELETE /api/comments/:id   # Delete comment
POST   /api/chat          # Chat functionality
```

### Admin APIs (Admin Role Required)
```
GET    /api/admin/blogs    # List all blogs (including drafts)
POST   /api/admin/blogs    # Create blog
PUT    /api/admin/blogs/:id # Update blog
DELETE /api/admin/blogs/:id # Delete blog
```

## Response Format Standards

### Success Response
```javascript
// ✅ Standard success response
{
  "data": [...],           // Array or object
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```javascript
// ✅ Standard error response
{
  "error": "Error message",
  "details": "Additional details",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Pagination Response
```javascript
// ✅ Paginated response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## HTTP Status Codes

### Success Codes
- `200` - OK (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)

### Client Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)

### Server Error Codes
- `500` - Internal Server Error
- `502` - Bad Gateway
- `503` - Service Unavailable

## Authentication Flow

### 1. Login Process
```javascript
// POST /api/auth/login
{
  "username": "user@example.com",
  "password": "password123"
}

// Response
{
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "isAdmin": false
    }
  },
  "message": "Login successful"
}
// JWT token set in HTTP-only cookie
```

### 2. Status Check
```javascript
// GET /api/auth/status
// Returns current user info if authenticated
{
  "data": {
    "authenticated": true,
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "isAdmin": false
    }
  }
}
```

### 3. Logout Process
```javascript
// POST /api/auth/logout
// Clears JWT cookie
{
  "message": "Logout successful"
}
```

## Middleware Chain

### Public Routes
```javascript
router.get("/", async (req, res) => {
  // No auth required
});
```

### Protected Routes
```javascript
router.post("/", authMiddleware, async (req, res) => {
  // req.user available
});
```

### Admin Routes
```javascript
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  // req.user.isAdmin === true
});
```

## Input Validation

### Request Body Validation
```javascript
const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().min(1).required(),
  tags: Joi.array().items(Joi.string()).optional()
});

router.post("/", async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details[0].message
    });
  }
  // Continue with validated data
});
```

### Query Parameter Validation
```javascript
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional()
});
```

## Error Handling

### Route-Level Error Handling
```javascript
router.get("/", async (req, res) => {
  try {
    const data = await service.getData();
    res.json({ data });
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message
      });
    }
    
    res.status(500).json({
      error: "Internal server error"
    });
  }
});
```

## CORS Configuration
```javascript
// ✅ CORS setup for cross-origin requests
app.use(cors({
  origin: process.env.ALLOW_CORS || "http://localhost:3000",
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Rate Limiting
```javascript
// ✅ Implement rate limiting for API endpoints
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests, please try again later"
  }
});

app.use('/api/', apiLimiter);
```

## Quick Checklist
- [ ] RESTful endpoint naming
- [ ] Proper HTTP status codes
- [ ] Consistent response format
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] Authentication middleware applied
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] API documentation updated

---
*See [Backend Rules](backend-rules.md) for implementation details and [Security Rules](security-rules.md) for auth patterns* 