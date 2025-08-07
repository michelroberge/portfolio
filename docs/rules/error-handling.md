# Error Handling Rules

## Quick Reference
**When to use**: Managing errors, logging, user feedback, and graceful degradation

## Core Rules

### 🛡️ **Error Handling Patterns**

#### Frontend Error Handling
```typescript
// ✅ Good - Service-level error handling
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
        throw new Error("Unauthorized access");
      }
      throw new Error(error.message || "Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Service error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}

// ✅ Good - Component error handling
export default function DataComponent() {
  const [data, setData] = useState<Data[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchServiceData();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### Backend Error Handling
```javascript
// ✅ Good - Service-level error handling
async function createEntity(data) {
  try {
    const entity = new Model(data);
    await entity.save();

    // Generate and store embeddings
    await updateEntityEmbeddings(entity);

    return entity;
  } catch (error) {
    console.error("❌ Entity creation error:", error);
    
    // Handle specific error types
    if (error.code === 11000) {
      throw new Error("Entity already exists");
    }
    if (error.name === 'ValidationError') {
      throw new Error("Invalid entity data");
    }
    
    throw new Error("Failed to create entity");
  }
}

// ✅ Good - Route-level error handling
router.post("/create", async (req, res) => {
  try {
    const entity = await createEntity(req.body);
    res.status(201).json(entity);
  } catch (error) {
    console.error("❌ Route error:", error);
    
    if (error.message === "Entity already exists") {
      return res.status(409).json({ 
        error: "Entity already exists" 
      });
    }
    if (error.message === "Invalid entity data") {
      return res.status(400).json({ 
        error: "Invalid entity data" 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});
```

### 📝 **Logging Patterns**

#### Frontend Logging
```typescript
// ✅ Good - Structured logging utility
export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  }
};

// ✅ Good - Error logging with context
export async function handleApiError(error: unknown, context: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  logger.error(`[${context}] Error:`, {
    message: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
  
  throw error;
}
```

#### Backend Logging
```javascript
// ✅ Good - Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details
  console.log('📝 [Request] Incoming request', {
    method: req.method,
    url: req.url,
    origin: req.get('origin'),
    userAgent: req.get('user-agent'),
    referer: req.get('referer'),
    host: req.get('host'),
    cookies: req.cookies,
    timestamp: new Date().toISOString()
  });

  // Intercept the response to log its status
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    
    // Log response details
    console.log('📝 [Response]', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      bodyLength: body ? body.length : 0
    });

    // If there's an error status, log more details
    if (res.statusCode >= 400) {
      console.error('❌ [Error Response]', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        body: typeof body === 'string' ? body : JSON.stringify(body),
        timestamp: new Date().toISOString()
      });
    }

    originalSend.call(this, body);
  };

  next();
};
```

### 🔄 **Error Recovery Patterns**

#### Retry Logic
```javascript
// ✅ Good - Retry mechanism with exponential backoff
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// ✅ Good - Service with retry
async function fetchWithRetry(url, options = {}) {
  return retryOperation(async () => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  });
}
```

#### Fallback Patterns
```typescript
// ✅ Good - Fallback data handling
export default function DataComponent() {
  const [data, setData] = useState<Data[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchServiceData();
        setData(result);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data");
        // Use fallback data
        setData(getFallbackData());
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-yellow-800">
          {error} - Showing cached data
        </p>
        <DataList data={data} />
      </div>
    );
  }

  return <DataList data={data} />;
}
```

### 🎯 **User-Facing Error Handling**

#### Error Boundaries
```typescript
// ✅ Good - React error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Form Validation Errors
```typescript
// ✅ Good - Form error handling
export default function FormComponent({ onSubmit }: FormProps) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed";
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`w-full p-2 border rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-800">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 🔐 **Authentication Error Handling**

#### Auth Error Patterns
```typescript
// ✅ Good - Authentication error handling
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string): Promise<void> {
    setError(null);

    try {
      const res = await fetch(AUTH_API.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password");
        }
        if (res.status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        }
        throw new Error(data.message || "Login failed");
      }

      await refreshAuth();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  }

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 🌐 **Network Error Handling**

#### WebSocket Error Handling
```typescript
// ✅ Good - WebSocket error handling
export function useWebSocketChat(isOpen: boolean) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      logger.log("✅ WebSocket connected");
      setConnected(true);
      setError(null);
    };

    websocket.onerror = (error) => {
      logger.error("❌ WebSocket connection error:", error);
      setError("Connection failed");
      setConnected(false);
    };

    websocket.onclose = (event) => {
      logger.log(`❌ WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
      setConnected(false);
      
      if (event.code !== 1000) { // Normal closure
        setError("Connection lost. Reconnecting...");
        // Implement reconnection logic
        setTimeout(() => {
          if (isOpen) {
            connectWebSocket();
          }
        }, 3000);
      }
    };

    return websocket;
  }, [wsUrl, isOpen]);

  return { connected, error, sendMessage };
}
```

## Common Patterns

### 🔄 **Error Recovery Strategies**
```typescript
// ✅ Good - Graceful degradation
export default function FeatureComponent() {
  const [data, setData] = useState<Data[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        console.error("Failed to load data:", err);
        
        // Try fallback data source
        try {
          const fallbackData = await fetchFallbackData();
          setData(fallbackData);
          setFallbackMode(true);
        } catch (fallbackErr) {
          setError("Unable to load data");
        }
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {fallbackMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            Showing cached data - some features may be limited
          </p>
        </div>
      )}
      <DataList data={data} />
    </div>
  );
}
```

## Quick Checklist

- [ ] **Error boundaries** are implemented for React components
- [ ] **Service-level errors** are properly caught and logged
- [ ] **User-friendly messages** are displayed for errors
- [ ] **Retry logic** is implemented for transient failures
- [ ] **Fallback mechanisms** are in place for critical features
- [ ] **Logging** is comprehensive and structured
- [ ] **Error recovery** strategies are implemented
- [ ] **Network errors** are handled gracefully
- [ ] **Authentication errors** are properly managed
- [ ] **Form validation** errors are user-friendly
- [ ] **Resiliency** errors that do not prevent normal usage of system will not terminate node server

## Cross-References

- [Frontend Rules](frontend-rules.md) - React error handling patterns
- [Backend Rules](backend-rules.md) - Express error handling patterns
- [Security Rules](security-rules.md) - Authentication error patterns

---

*Follow these error handling patterns to create robust, user-friendly applications.*
