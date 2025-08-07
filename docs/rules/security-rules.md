# Security Rules

## Quick Reference
**When to use**: Authentication, authorization, input validation, and security best practices

## Core Rules

### 🔐 **Authentication Patterns**

#### JWT Token Management
```javascript
// ✅ Good - JWT service with proper validation
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
    issuer: "portfolio-app",
    audience: "portfolio-users"
  });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY, {
      issuer: "portfolio-app",
      audience: "portfolio-users"
    });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Token expired");
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
}
```

#### OIDC Integration
```javascript
// ✅ Good - OIDC service with caching and validation
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

// ✅ Good - OIDC callback with proper validation
router.get('/oidc/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=missing_code`);
  }
  
  try {
    const oidcConfig = await getOIDCConfig();
    
    // Exchange code for tokens
    const tokenRes = await fetch(oidcConfig.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET,
        redirect_uri: process.env.OIDC_REDIRECT_URI,
      }),
    });
    
    if (!tokenRes.ok) {
      throw new Error('Token exchange failed');
    }
    
    const tokenData = await tokenRes.json();
    
    // Get user info with token validation
    const userInfoRes = await fetch(oidcConfig.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    if (!userInfoRes.ok) {
      throw new Error('User info failed');
    }
    
    const userInfo = await userInfoRes.json();
    
    // Check for admin role in OIDC claims
    const isAdmin = checkAdminRole(userInfo, tokenData);
    
    // Authenticate or create user
    const authRes = await fetch(`${process.env.BACKEND_URL}/api/auth/oidc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        sub: userInfo.sub,
        provider: 'oidc',
        isAdmin: isAdmin,
      }),
    });
    
    const authData = await authRes.json();
    if (!authData.success) throw new Error('OIDC backend auth failed');
    
    // Set secure auth cookie
    res.cookie('auth-token', authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    });
    
    res.redirect(`${process.env.FRONTEND_URL}/admin`);
  } catch (err) {
    console.error('OIDC callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=oidc_failed`);
  }
});
```

### 🛡️ **Authorization Patterns**

#### Middleware Protection
```javascript
// ✅ Good - Authentication middleware
const authService = require("../services/authService");

module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"] || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Good - Admin authorization middleware
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};
```

#### Frontend Authorization
```typescript
// ✅ Good - Protected route component
export default function ProtectedRoute({ children, requireAdmin = false }: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
    
    if (!loading && requireAdmin && !isAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, loading, requireAdmin, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return <div>Access denied</div>;
  }

  return <>{children}</>;
}

// ✅ Good - Admin-only component
export default function AdminComponent() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Admin content */}
    </div>
  );
}
```

### 🔒 **Input Validation**

#### Backend Validation
```javascript
// ✅ Good - Input validation with Joi
const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'any.required': 'Password is required'
    })
});

// ✅ Good - Validation middleware
const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
};

router.post("/register", validateUser, async (req, res) => {
  try {
    const user = await createUser(req.validatedData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Frontend Validation
```typescript
// ✅ Good - Form validation with error handling
export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username must contain only letters and numbers';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await registerUser(formData);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields with error display */}
    </form>
  );
}
```

### 🔐 **Password Security**

#### Password Hashing
```javascript
// ✅ Good - Password hashing with bcrypt
const bcrypt = require("bcrypt");

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password validation method
UserSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};
```

#### Password Policy Enforcement
```typescript
// ✅ Good - Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 🛡️ **Session Security**

#### Session Configuration
```javascript
// ✅ Good - Secure session configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (mongooseConnection) => {
  return session({
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongooseConnection.getClient(),
      dbName: process.env.MONGO_DB_NAME || 'sessiondb',
      collectionName: 'sessions',
      ttl: 60 * 60 * 24, // 1 day in seconds
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    },
    name: 'sessionId', // Don't use default 'connect.sid'
  });
};
```

#### CSRF Protection
```javascript
// ✅ Good - CSRF token validation
const crypto = require('crypto');

// Generate CSRF token
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Validate CSRF token
function validateCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
}

// CSRF middleware
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    req.session.csrfToken = token;
    res.locals.csrfToken = token;
    next();
  } else {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    if (!validateCSRFToken(token, req.session.csrfToken)) {
      return res.status(403).json({ error: 'CSRF token validation failed' });
    }
    next();
  }
};
```

### 🔒 **Data Sanitization**

#### XSS Prevention
```typescript
// ✅ Good - Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// ✅ Good - HTML content sanitization
export function sanitizeHTML(html: string): string {
  // Use a library like DOMPurify in production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}
```

#### SQL Injection Prevention
```javascript
// ✅ Good - Parameterized queries with Mongoose
// Mongoose automatically prevents SQL injection by using parameterized queries

// ✅ Good - Input validation for database queries
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!validateObjectId(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Common Patterns

### 🔄 **Rate Limiting**
```javascript
// ✅ Good - Rate limiting middleware
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Apply rate limiting
app.use('/api/auth/login', loginLimiter);
app.use('/api', apiLimiter);
```

### 🔄 **Security Headers**
```javascript
// ✅ Good - Security headers middleware
const helmet = require('helmet');

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
```

## Quick Checklist

- [ ] **JWT tokens** are properly signed and validated
- [ ] **OIDC integration** is securely implemented
- [ ] **Password hashing** uses bcrypt with salt
- [ ] **Input validation** is performed on all user inputs
- [ ] **CSRF protection** is implemented
- [ ] **XSS prevention** measures are in place
- [ ] **SQL injection** prevention is implemented
- [ ] **Rate limiting** is configured
- [ ] **Security headers** are set
- [ ] **Session management** is secure
- [ ] **Authorization** checks are implemented
- [ ] **Error messages** don't leak sensitive information

## Cross-References

- [Backend Rules](backend-rules.md) - Express security patterns
- [API Rules](api-rules.md) - API security patterns
- [Error Handling](error-handling.md) - Security error patterns

---

*Follow these security patterns to create secure, robust applications.*
