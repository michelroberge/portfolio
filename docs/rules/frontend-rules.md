# Frontend Rules

## Quick Reference
**When to use**: Creating React components, TypeScript interfaces, Next.js pages, or frontend services.

## Core Rules

### 1. TypeScript First
```typescript
// ✅ Always use TypeScript interfaces
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  optional?: boolean;
}

// ✅ Use strict typing
export default function MyComponent({ title, onAction }: ComponentProps) {
  // Implementation
}
```

### 2. Component Structure
```typescript
// ✅ Standard component structure
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks first
  const [state, setState] = useState();
  const { data } = useCustomHook();
  
  // 2. Event handlers
  const handleClick = () => {
    // Implementation
  };
  
  // 3. Render
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

### 3. Service Layer Pattern
```typescript
// ✅ API service functions
export async function fetchData(id: string): Promise<DataType> {
  try {
    const response = await fetch(API_ENDPOINT(id), {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch data:", err);
    throw err;
  }
}
```

### 4. Backend Route contants
```typescript
// ✅ Ensure API backend endpoint constants
export const ADMIN_API = {
  base: `${REMOTE_URL}${API_BASE}/admin`,
    entity: {
    list:  `${REMOTE_URL}${API_BASE}/admin/entity`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/admin/entity/${id}`,
    create: `${REMOTE_URL}${API_BASE}/admin/entity`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/admin/entity/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/admin/entity/${id}`,
    generateEmbeddings: `${REMOTE_URL}${API_BASE}/admin/entity/generate-embeddings`,
  },
};
```

### 5. Model Definitions
```typescript
// ✅ Base interface for common properties
export interface BaseEntity {
  title: string;
  description: string;
}

// ✅ Full entity with all properties
export interface Entity extends BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Create/Update types
export interface EntityCreate extends BaseEntity {}
export type EntityUpdate = Partial<BaseEntity>;
```

## Folder Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and constants
├── models/               # TypeScript interfaces/types
├── services/             # API service functions
└── utils/                # Utility functions
```

## Common Patterns

### Context Pattern
```typescript
// ✅ Create context with proper typing
interface ContextType {
  value: string;
  setValue: (value: string) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

// ✅ Provider component
export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState("");
  
  return (
    <Context.Provider value={{ value, setValue }}>
      {children}
    </Context.Provider>
  );
}

// ✅ Custom hook for consuming context
export function useContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContext must be used within ContextProvider");
  }
  return context;
}
```

### Error Handling
```typescript
// ✅ Component error handling
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  const data = await fetchData();
  setData(data);
} catch (err) {
  setError("Failed to load data");
} finally {
  setLoading(false);
}
```

## Styling Rules
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic class names
- Create custom components for repeated patterns

## Testing Rules
- Write tests for all components
- Use React Testing Library
- Test user interactions, not implementation details
- Mock external dependencies

## Quick Checklist
- [ ] TypeScript interfaces defined
- [ ] Component follows standard structure
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Responsive design applied
- [ ] Tests written
- [ ] Service layer used for API calls

---
*See [Component Patterns](component-patterns.md) for detailed examples* 