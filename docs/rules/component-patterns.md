# Component Patterns

## Quick Reference
**When to use**: Creating React components, organizing component logic, managing state and props

## Core Rules

### 🧩 **Component Structure**

#### Standard Component Template
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '@/models/Component';

interface Props {
  // Define all props with types
  title: string;
  isVisible?: boolean;
  onAction?: (data: any) => void;
}

export default function ComponentName({ title, isVisible = true, onAction }: Props) {
  // State management
  const [state, setState] = useState<StateType>(initialState);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Early returns
  if (!isVisible) return null;
  
  return (
    <div className="component-classes">
      {/* JSX content */}
    </div>
  );
}
```

#### Admin Component Pattern
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';
import { AdminLayout } from '@/components/layouts/AdminLayout';

interface Props {
  // Admin-specific props
}

export default function AdminComponent({ prop1, prop2 }: Props) {
  const { isAdmin } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  
  // Admin-only logic
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return (
    <AdminLayout>
      {/* Admin content */}
    </AdminLayout>
  );
}
```

### 🎯 **Props Patterns**

#### Interface Definitions
```typescript
// ✅ Good - Specific, typed interfaces
interface BlogListProps {
  blogs: BlogEntry[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

// ✅ Good - Extending existing interfaces
interface EditFormProps extends BaseFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
}

// ❌ Bad - Using any or generic types
interface BadProps {
  data: any;
  handler: Function;
}
```

#### Default Props
```typescript
// ✅ Good - Using default parameters
export default function Component({ 
  title = "Default Title",
  isVisible = true,
  items = []
}: Props) {
  // Component logic
}

// ✅ Good - Using destructuring with defaults
export default function Component(props: Props) {
  const { 
    title = "Default Title",
    isVisible = true,
    items = []
  } = props;
  
  // Component logic
}
```

### 🔄 **State Management Patterns**

#### Local State
```typescript
// ✅ Good - Typed state
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// ✅ Good - Complex state object
const [formState, setFormState] = useState<FormState>({
  title: '',
  content: '',
  isValid: false
});

// ✅ Good - State updates
const updateItem = (id: string, updates: Partial<Item>) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};
```

#### Context Usage
```typescript
// ✅ Good - Using context hooks
const { isAuthenticated, isAdmin } = useAuth();
const { showLoading, hideLoading } = useLoading();
const { query, setQuery, results } = useSearch();

// ✅ Good - Context with error handling
const { user, refreshAuth } = useAuth();
if (!user) {
  return <div>Please log in</div>;
}
```

### 🎨 **Styling Patterns**

#### Tailwind CSS Classes
```typescript
// ✅ Good - Responsive design
<div className="w-full md:w-1/2 lg:w-1/3 p-4">
  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
    {title}
  </h2>
</div>

// ✅ Good - Conditional classes
<button 
  className={`px-4 py-2 rounded transition-colors ${
    isActive 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }`}
>
  {label}
</button>

// ✅ Good - Dark mode support
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  {content}
</div>
```

#### Component-Specific Styling
```typescript
// ✅ Good - Consistent spacing and layout
<div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold">{title}</h3>
  <p className="text-gray-600 dark:text-gray-300">{description}</p>
  <div className="flex gap-2">
    {actions}
  </div>
</div>
```

### 🔗 **Event Handling Patterns**

#### Click Handlers
```typescript
// ✅ Good - Typed event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  onAction?.(data);
};

// ✅ Good - Async handlers with loading states
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);
  try {
    await onSubmit(formData);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### Form Handling
```typescript
// ✅ Good - Controlled inputs
const [formData, setFormData] = useState({
  title: '',
  content: ''
});

const handleChange = (field: keyof typeof formData) => (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setFormData(prev => ({
    ...prev,
    [field]: event.target.value
  }));
};

return (
  <form onSubmit={handleSubmit}>
    <input
      value={formData.title}
      onChange={handleChange('title')}
      className="w-full p-2 border rounded"
    />
  </form>
);
```

## Common Patterns

### 📋 **List Components**
```typescript
// ✅ Good - List with proper keys
export default function ItemList({ items, onItemClick }: ItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div 
          key={item.id}
          onClick={() => onItemClick?.(item.id)}
          className="p-4 border rounded cursor-pointer hover:bg-gray-50"
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 🔍 **Search/Filter Components**
```typescript
// ✅ Good - Search with debouncing
export default function SearchComponent({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      className="w-full p-2 border rounded"
    />
  );
}
```

### 📝 **Form Components**
```typescript
// ✅ Good - Reusable form component
export default function FormComponent({ initialData, onSubmit }: FormProps) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

## Quick Checklist

- [ ] **Component structure** follows standard template
- [ ] **Props interface** is properly typed
- [ ] **State management** uses appropriate patterns
- [ ] **Event handlers** are properly typed
- [ ] **Styling** uses Tailwind CSS consistently
- [ ] **Dark mode** support is included
- [ ] **Error handling** is implemented
- [ ] **Loading states** are managed
- [ ] **Accessibility** attributes are included
- [ ] **Responsive design** is implemented

## Cross-References

- [Frontend Rules](frontend-rules.md) - React and TypeScript patterns
- [Styling Rules](styling-rules.md) - Tailwind CSS patterns
- [State Management](state-management.md) - Context and hooks patterns

---

*Follow these component patterns to create consistent, maintainable React components.*
