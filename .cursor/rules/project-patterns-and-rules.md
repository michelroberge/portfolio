---
description: Project patterns and rules
globs:
alwaysApply: true
---

# Project Patterns and Rules - Overview

## Quick Reference

This is the **main rule index**. For detailed patterns, see the specific rule files below.

### Technology Stack
- **Frontend**: Next.js 15 + TypeScript + React 19 + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + CommonJS
- **Architecture**: Monorepo with separate frontend/backend

### Project Structure
```
portfolio/
├── portfolio.next/     # Frontend (Next.js + TypeScript)
├── portfolio.node/     # Backend (Express + MongoDB)
└── docs/
    ├── rules/          # Detailed rule files
    └── patterns/       # Pattern examples
```

## Rule Categories

### 🎯 **Core Rules** (Start Here)
- [Frontend Rules](docs/rules/frontend-rules.md) - React, TypeScript, Next.js patterns
- [Backend Rules](docs/rules/backend-rules.md) - Express, MongoDB, Node.js patterns
- [API Rules](docs/rules/api-rules.md) - REST endpoints, authentication, responses

### 🏗️ **Architecture Rules**
- [Project Structure](docs/rules/structure-rules.md) - Folder organization, naming
- [Component Patterns](docs/rules/component-patterns.md) - React component structure
- [Service Patterns](docs/rules/service-patterns.md) - Business logic organization

### 🛡️ **Quality Rules**
- [Testing Rules](docs/rules/testing-rules.md) - Jest, RTL, test structure
- [Error Handling](docs/rules/error-handling.md) - Frontend/backend error patterns
- [Security Rules](docs/rules/security-rules.md) - Auth, validation, CORS

### 🎨 **UI/UX Rules**
- [Styling Rules](docs/rules/styling-rules.md) - Tailwind CSS, responsive design
- [State Management](docs/rules/state-management.md) - Context API, hooks

### 🚀 **DevOps Rules**
- [Environment Rules](docs/rules/environment-rules.md) - Config, env vars
- [Deployment Rules](docs/rules/deployment-rules.md) - Docker, CI/CD

## Quick Decision Tree

**What are you working on?**

1. **Frontend Component** → [Frontend Rules](docs/rules/frontend-rules.md)
2. **Backend API** → [Backend Rules](docs/rules/backend-rules.md) + [API Rules](docs/rules/api-rules.md)
3. **Database Model** → [Backend Rules](docs/rules/backend-rules.md)
4. **Styling** → [Styling Rules](docs/rules/styling-rules.md)
5. **Testing** → [Testing Rules](docs/rules/testing-rules.md)
6. **Authentication** → [Security Rules](docs/rules/security-rules.md)
7. **New Feature** → Start with [Project Structure](docs/rules/structure-rules.md)

## Key Principles (Remember These)

1. **TypeScript First** - All frontend code uses strict TypeScript
2. **Service Layer** - Business logic goes in services, not components/routes
3. **Error Handling** - Always handle errors gracefully with proper logging
4. **Testing** - Write tests for new features and critical paths
5. **Consistency** - Follow established patterns, don't reinvent

## When to Reference This File

- **Starting a new feature** - Check relevant rule files
- **Code review** - Verify against applicable rules
- **Onboarding** - Understand project structure
- **Architecture decisions** - Ensure alignment with patterns

---

*For detailed examples and specific patterns, see the individual rule files in `docs/rules/`* 