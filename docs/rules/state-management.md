# State Management Rules

## Quick Reference
**When to use**: Managing application state, context providers, custom hooks, and data flow

## Core Rules

### 🔄 **Context API Patterns**

#### Context Provider Structure
```typescript
// ✅ Good - Context with proper typing
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin ?? false;

  // Check auth status when component mounts
  useEffect(() => {
    refreshAuth();
  }, []);

  async function refreshAuth() {
    try {
      const { authenticated, user: authUser } = await checkAuthStatus();
      
      if (!authenticated) {
        setUser(null);
        return;
      }

      setUser(authUser);
    } catch (err) {
      console.error('Failed to refresh auth:', err);
      setUser(null);
      setError("Authentication failed");
    }
  }

  async function login(username: string, password: string): Promise<void> {
    setLoading(true);
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
        setError(data.message || "Login failed");
        return;
      }

      await refreshAuth();
    } catch (err) {
      console.error('Failed to login:', err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setError(null);
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Good - Custom hook for context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### Loading Context Pattern
```typescript
// ✅ Good - Loading state management
interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount(prev => prev + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prev => Math.max(0, prev - 1));
  }, []);

  const value: LoadingContextType = {
    isLoading: loadingCount > 0,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
```

### 🎣 **Custom Hooks Patterns**

#### Data Fetching Hooks
```typescript
// ✅ Good - Custom hook for data fetching
export function useDataFetching<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          credentials: "include",
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch data";
        setError(message);
        console.error("Data fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, refetch: () => fetchData() };
}

// ✅ Good - Hook with dependencies
export function useUserData(userId: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchUserById(userId);
        setUserData(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch user data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return { userData, loading, error };
}
```

#### Form State Hooks
```typescript
// ✅ Good - Form state management hook
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(newErrors);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateFields,
    resetForm,
    setFieldError,
    setErrors,
    setIsSubmitting,
  };
}

// ✅ Good - Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  formData: T,
  validationRules: ValidationRules<T>
) {
  const validate = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};

    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T;
      const value = formData[fieldKey];
      const rules = validationRules[fieldKey];

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[fieldKey] = rules.required;
      } else if (rules.pattern && value && !rules.pattern.test(String(value))) {
        errors[fieldKey] = rules.patternMessage || 'Invalid format';
      } else if (rules.custom) {
        const customError = rules.custom(value, formData);
        if (customError) {
          errors[fieldKey] = customError;
        }
      }
    });

    return errors;
  }, [formData, validationRules]);

  return { validate };
}
```

#### WebSocket Hooks
```typescript
// ✅ Good - WebSocket hook
export function useWebSocketChat(isOpen: boolean) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (typeof window === "undefined") return;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      logger.log("✅ WebSocket connected");
      setConnected(true);
      setError(null);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.response) {
          setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
        }
      } catch (err) {
        logger.error("Failed to parse WebSocket message:", err);
      }
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
        setTimeout(() => {
          if (isOpen) {
            connectWebSocket();
          }
        }, 3000);
      }
    };

    wsRef.current = websocket;
  }, [wsUrl, isOpen]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
      setMessages(prev => [...prev, { role: 'user', text: message }]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, connectWebSocket]);

  return { connected, messages, error, sendMessage };
}
```

### 🔄 **State Update Patterns**

#### Immutable Updates
```typescript
// ✅ Good - Immutable state updates
export function useListState<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => (item as any).id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearItems,
  };
}

// ✅ Good - Complex state updates
export function useAppState() {
  const [state, setState] = useState({
    user: null,
    settings: {},
    notifications: [],
    theme: 'light',
  });

  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : userData,
    }));
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  return {
    ...state,
    updateUser,
    addNotification,
    removeNotification,
    updateSettings,
  };
}
```

#### Optimistic Updates
```typescript
// ✅ Good - Optimistic updates
export function useOptimisticUpdate<T>(
  items: T[],
  updateFunction: (id: string, updates: Partial<T>) => Promise<T>
) {
  const [optimisticItems, setOptimisticItems] = useState<T[]>(items);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const updateItem = useCallback(async (id: string, updates: Partial<T>) => {
    // Optimistic update
    setOptimisticItems(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    ));
    setPendingUpdates(prev => new Set(prev).add(id));

    try {
      // Actual API call
      const updatedItem = await updateFunction(id, updates);
      
      // Update with server response
      setOptimisticItems(prev => prev.map(item => 
        (item as any).id === id ? updatedItem : item
      ));
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticItems(items);
      console.error('Update failed:', error);
    } finally {
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [items, updateFunction]);

  return {
    items: optimisticItems,
    updateItem,
    isPending: (id: string) => pendingUpdates.has(id),
  };
}
```

### 🎯 **Context Composition**

#### Provider Composition
```typescript
// ✅ Good - Composed providers
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <SearchProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SearchProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

// ✅ Good - Provider with dependencies
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await performSearch(query, isAuthenticated);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, isAuthenticated]);

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    loading,
    handleSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}
```

### 🔄 **Performance Optimization**

#### Memoization Patterns
```typescript
// ✅ Good - Memoized selectors
export function useUserPermissions() {
  const { user } = useAuth();
  
  return useMemo(() => {
    if (!user) return { canEdit: false, canDelete: false, canAdmin: false };
    
    return {
      canEdit: user.role === 'editor' || user.role === 'admin',
      canDelete: user.role === 'admin',
      canAdmin: user.role === 'admin',
    };
  }, [user]);

// ✅ Good - Memoized callbacks
export function useDataActions() {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const createItem = useCallback(async (data: CreateItemData) => {
    if (!user) throw new Error('Authentication required');
    
    showLoading();
    try {
      const result = await createItemAPI(data);
      return result;
    } finally {
      hideLoading();
    }
  }, [user, showLoading, hideLoading]);

  const updateItem = useCallback(async (id: string, data: UpdateItemData) => {
    if (!user) throw new Error('Authentication required');
    
    showLoading();
    try {
      const result = await updateItemAPI(id, data);
      return result;
    } finally {
      hideLoading();
    }
  }, [user, showLoading, hideLoading]);

  return { createItem, updateItem };
}
```

## Common Patterns

### 🔄 **State Persistence**
```typescript
// ✅ Good - Local storage persistence
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setState(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [state, setValue];
}

// ✅ Good - Session storage for temporary state
export function useSessionState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setState(value);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key]);

  return [state, setValue];
}
```

### 🔄 **State Synchronization**
```typescript
// ✅ Good - State synchronization between components
export function useSharedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = useCallback((value: T) => {
    setState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key]);

  return [state, setValue];
}
```

## Quick Checklist

- [ ] **Context providers** are properly typed and structured
- [ ] **Custom hooks** follow naming conventions and patterns
- [ ] **State updates** are immutable and optimized
- [ ] **Performance** is considered with memoization
- [ ] **Error handling** is implemented in async operations
- [ ] **Loading states** are managed consistently
- [ ] **State persistence** is implemented where needed
- [ ] **Dependencies** are properly managed in useEffect
- [ ] **Cleanup** is performed in useEffect return functions
- [ ] **Context composition** follows proper hierarchy

## Cross-References

- [Component Patterns](component-patterns.md) - React component state patterns
- [Frontend Rules](frontend-rules.md) - React and TypeScript patterns
- [Error Handling](error-handling.md) - State error patterns

---

*Follow these state management patterns to create maintainable and performant React applications.*
