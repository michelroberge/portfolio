# Project Structure Rules

## Quick Reference
**When to use**: Organizing folders, naming files, structuring components and services

## Core Rules

### 📁 **Folder Organization**

#### Frontend (portfolio.next/)
```
src/
├── app/                    # Next.js 15 app router pages
│   ├── admin/             # Admin-only pages
│   ├── api/               # API routes
│   └── [dynamic]/         # Dynamic routes
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── layouts/          # Layout components
│   └── [feature]/        # Feature-specific components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and constants
├── models/               # TypeScript interfaces and types
├── services/             # API service functions
└── utils/                # Helper utilities
```

#### Backend (portfolio.node/)
```
src/
├── app.js                # Main application entry point
├── config/               # Configuration files
├── docs/                 # API documentation
├── middlewares/          # Express middlewares
├── models/               # Mongoose models
├── routes/               # Express route handlers
│   ├── admin/           # Admin-only routes
│   └── [feature]/       # Feature-specific routes
├── services/            # Business logic services
├── utils/               # Helper utilities
└── validators/          # Input validation schemas
```

### 🏷️ **Naming Conventions**

#### Files and Folders
- **PascalCase**: React components, TypeScript interfaces
- **camelCase**: JavaScript/TypeScript files, functions, variables
- **kebab-case**: URLs, API endpoints, CSS classes
- **UPPER_SNAKE_CASE**: Environment variables, constants

#### Examples
```typescript
// ✅ Good
components/AdminDashboard.tsx
services/userService.ts
models/User.ts
utils/logger.ts

// ❌ Bad
components/admin-dashboard.tsx
services/UserService.ts
models/user.ts
utils/Logger.ts
```

### 📄 **File Structure Patterns**

#### React Components
```typescript
// ✅ Standard component structure
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '@/models/Component';

interface Props {
  // Props interface
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    // JSX
  );
}
```

#### Service Files
```typescript
// ✅ Service structure
import { API_ENDPOINTS } from '@/lib/constants';
import { ServiceType } from '@/models/Service';

export async function serviceFunction(): Promise<ServiceType> {
  try {
    // Service logic
  } catch (error) {
    // Error handling
  }
}
```

#### Backend Models
```javascript
// ✅ Mongoose model structure
const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  // Schema definition
}, {
  timestamps: true
});

// Pre-save hooks
ModelSchema.pre("save", async function (next) {
  // Pre-save logic
});

module.exports = mongoose.model("ModelName", ModelSchema);
```

## Common Patterns

### 🔄 **Import/Export Patterns**

#### Frontend Imports
```typescript
// ✅ Absolute imports with @ alias
import { Component } from '@/components/Component';
import { useHook } from '@/hooks/useHook';
import { Service } from '@/services/service';
import { Model } from '@/models/Model';

// ✅ Relative imports for closely related files
import { SubComponent } from './SubComponent';
import { types } from './types';
```

#### Backend Imports
```javascript
// ✅ Relative imports for internal modules
const service = require("../services/service");
const model = require("../models/Model");
const middleware = require("../middlewares/middleware");

// ✅ Package imports
const express = require("express");
const mongoose = require("mongoose");
```

### 🎯 **Component Organization**

#### Feature-Based Structure
```
components/
├── admin/
│   ├── AdminDashboard.tsx
│   ├── UserList.tsx
│   └── EditForm.tsx
├── blog/
│   ├── BlogView.tsx
│   └── BlogList.tsx
└── project/
    ├── ProjectView.tsx
    └── ProjectCard.tsx
```

#### Shared Components
```
components/
├── Header.tsx
├── Footer.tsx
├── LoadingOverlay.tsx
└── MarkdownEditor.tsx
```

## Quick Checklist

- [ ] **Folder structure** follows established patterns
- [ ] **File naming** uses correct conventions
- [ ] **Import paths** use absolute imports with @ alias (frontend)
- [ ] **Component structure** follows standard template
- [ ] **Service organization** separates business logic
- [ ] **Model definitions** include proper schemas and hooks
- [ ] **Route organization** groups by feature and access level
- [ ] **Type definitions** are in separate model files

## Cross-References

- [Frontend Rules](frontend-rules.md) - React component patterns
- [Backend Rules](backend-rules.md) - Express and MongoDB patterns
- [Service Patterns](service-patterns.md) - Business logic organization

---

*Follow these structure patterns to maintain consistency across the project.*
