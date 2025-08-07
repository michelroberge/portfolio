# Testing Rules

## Quick Reference
**When to use**: Writing unit tests, integration tests, component tests, and API tests

## Core Rules

### 🧪 **Test Structure**

#### Frontend Component Test
```typescript
// ✅ Good - Component test with proper setup
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '@/components/ComponentName';
import { useAuth } from '@/context/AuthContext';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ComponentName', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });
  });

  it('renders component correctly', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const mockOnClick = jest.fn();
    render(<ComponentName onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('shows admin content when user is admin', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    render(<ComponentName />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
```

#### Backend Service Test
```javascript
// ✅ Good - Service test with proper mocking
const { describe, test, expect, jest, beforeEach, afterEach } = require('@jest/globals');
const service = require('../../src/services/service');
const Model = require('../../src/models/Model');

// Mock dependencies
jest.mock('../../src/models/Model');
jest.mock('../../src/services/embeddingService');

describe('Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should create entity successfully', async () => {
    const mockData = { title: 'Test', content: 'Content' };
    const mockEntity = { _id: '123', ...mockData };
    
    Model.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockEntity)
    }));

    const result = await service.createEntity(mockData);
    
    expect(result).toEqual(mockEntity);
    expect(Model).toHaveBeenCalledWith(mockData);
  });

  test('should handle creation errors', async () => {
    const mockData = { title: 'Test' };
    const mockError = new Error('Database error');
    
    Model.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(mockError)
    }));

    await expect(service.createEntity(mockData)).rejects.toThrow('Failed to create entity');
  });
});
```

### 🎯 **Test Organization**

#### File Structure
```
__tests__/
├── components/
│   ├── ComponentName.test.tsx
│   └── admin/
│       └── AdminComponent.test.tsx
├── services/
│   ├── serviceName.test.ts
│   └── apiService.test.ts
├── models/
│   └── ModelName.test.js
├── routes/
│   └── routeName.test.js
└── integration/
    └── featureName.test.js
```

#### Test Naming Convention
```typescript
// ✅ Good - Descriptive test names
describe('UserService', () => {
  it('should create user with valid data', () => {});
  it('should reject user with invalid email', () => {});
  it('should handle database connection errors', () => {});
  it('should update user profile successfully', () => {});
});

// ✅ Good - Component test descriptions
describe('LoginForm', () => {
  it('renders login form with all fields', () => {});
  it('validates required fields before submission', () => {});
  it('shows error message for invalid credentials', () => {});
  it('redirects to dashboard on successful login', () => {});
});
```

### 🔧 **Mocking Patterns**

#### Context Mocking
```typescript
// ✅ Good - Context provider mocking
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/context/LoadingContext', () => ({
  useLoading: jest.fn(),
}));

describe('Component', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseLoading = useLoading as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    });
    
    mockUseLoading.mockReturnValue({
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    });
  });
});
```

#### API Mocking
```typescript
// ✅ Good - Fetch API mocking
describe('API Service', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: '1', title: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchData('1');
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('/api/data/1', {
      credentials: 'include',
    });
  });

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchData('1')).rejects.toThrow('Error fetching data: Not Found');
  });
});
```

#### Database Mocking
```javascript
// ✅ Good - Mongoose model mocking
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should find user by username', async () => {
    const mockUser = { _id: '123', username: 'testuser' };
    User.findOne.mockResolvedValue(mockUser);

    const result = await findUserByUsername('testuser');
    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
  });
});
```

### 🎨 **Component Testing Patterns**

#### User Interaction Testing
```typescript
// ✅ Good - User interaction tests
describe('Form Component', () => {
  it('should handle form submission', async () => {
    const mockOnSubmit = jest.fn();
    render(<FormComponent onSubmit={mockOnSubmit} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: 'Test Content' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
      });
    });
  });

  it('should validate required fields', async () => {
    render(<FormComponent onSubmit={jest.fn()} />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });
});
```

#### Async Testing
```typescript
// ✅ Good - Async operation testing
describe('Async Component', () => {
  it('should load data on mount', async () => {
    const mockData = [{ id: '1', title: 'Item 1' }];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    render(<DataComponent />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    // Verify loading state was shown
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle loading errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(<DataComponent />);

    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
  });
});
```

### 🔍 **Integration Testing**

#### API Route Testing
```javascript
// ✅ Good - Express route testing
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/login should authenticate user', async () => {
    // Create test user
    const testUser = new User({
      username: 'testuser',
      passwordHash: 'hashedpassword',
    });
    await testUser.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe('testuser');
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'invalid',
        password: 'wrong',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });
});
```

#### Database Integration Testing
```javascript
// ✅ Good - Database integration tests
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');

describe('User Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should create user with valid data', async () => {
    const userData = {
      username: 'testuser',
      passwordHash: 'hashedpassword',
      isAdmin: false,
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.isAdmin).toBe(userData.isAdmin);
  });

  test('should enforce unique username constraint', async () => {
    const userData = { username: 'testuser', passwordHash: 'hash' };

    await new User(userData).save();

    await expect(new User(userData).save()).rejects.toThrow();
  });
});
```

### 📊 **Test Coverage Patterns**

#### Coverage Configuration
```javascript
// ✅ Good - Jest configuration with coverage
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

#### Test Utilities
```typescript
// ✅ Good - Test utility functions
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider>
        <LoadingProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </LoadingProvider>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

export const createMockUser = (overrides = {}) => ({
  _id: '123',
  username: 'testuser',
  isAdmin: false,
  ...overrides,
});
```

## Common Patterns

### 🔄 **Hook Testing**
```typescript
// ✅ Good - Custom hook testing
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '@/hooks/useCustomHook';

describe('useCustomHook', () => {
  it('should provide initial state', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.value).toBe(initialValue);
  });

  it('should update state when action is called', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.updateValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
```

### 🔄 **Error Boundary Testing**
```typescript
// ✅ Good - Error boundary testing
describe('ErrorBoundary', () => {
  it('should catch and display errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

## Quick Checklist

- [ ] **Test structure** follows established patterns
- [ ] **Test names** are descriptive and clear
- [ ] **Mocking** is properly implemented
- [ ] **Async operations** are properly tested
- [ ] **Error scenarios** are covered
- [ ] **User interactions** are tested
- [ ] **Integration tests** are included
- [ ] **Test coverage** meets thresholds
- [ ] **Test utilities** are created for common patterns
- [ ] **Cleanup** is performed after tests

## Cross-References

- [Frontend Rules](frontend-rules.md) - React component patterns
- [Backend Rules](backend-rules.md) - Express and MongoDB patterns
- [Error Handling](error-handling.md) - Error management patterns

---

*Follow these testing patterns to create reliable, maintainable tests.*
