# Rules Directory

## Overview
This directory contains **modular, focused rule files** for efficient AI context usage. Instead of one massive rule file, we use a "choose your own adventure" approach.

## Why This Structure?

### ✅ **Efficient for AI**
- **Context Optimization**: Only load relevant rules when needed
- **Faster Processing**: AI can focus on specific patterns
- **Reduced Confusion**: Clear, focused guidance per task type

### ✅ **Better for Humans**
- **Easy Navigation**: Find rules quickly by task type
- **Maintainable**: Update specific rules without touching others
- **Scalable**: Add new rule categories as project grows

## How to Use

### For AI Assistants
1. **Start with the main index**: `docs/project-patterns-and-rules.md`
2. **Follow the decision tree** to find relevant rules
3. **Load only needed files** into context
4. **Reference specific patterns** as needed

### For Developers
1. **Check the main index** when starting new work
2. **Reference specific rule files** for detailed patterns
3. **Update rules** as patterns evolve
4. **Add new rule files** for new categories

## Rule File Categories

### 🎯 **Core Rules** (Most Used)
- `frontend-rules.md` - React, TypeScript, Next.js
- `backend-rules.md` - Express, MongoDB, Node.js  
- `api-rules.md` - REST endpoints, authentication

### 🏗️ **Architecture Rules**
- `structure-rules.md` - Folder organization, naming
- `component-patterns.md` - React component structure
- `service-patterns.md` - Business logic organization

### 🛡️ **Quality Rules**
- `testing-rules.md` - Jest, RTL, test structure
- `error-handling.md` - Frontend/backend error patterns
- `security-rules.md` - Auth, validation, CORS

### 🎨 **UI/UX Rules**
- `styling-rules.md` - Tailwind CSS, responsive design
- `state-management.md` - Context API, hooks

### 🚀 **DevOps Rules**
- `environment-rules.md` - Config, env vars
- `deployment-rules.md` - Docker, CI/CD

## Quick Decision Tree

**What are you working on?**

1. **Frontend Component** → `frontend-rules.md`
2. **Backend API** → `backend-rules.md` + `api-rules.md`
3. **Database Model** → `backend-rules.md`
4. **Styling** → `styling-rules.md`
5. **Testing** → `testing-rules.md`
6. **Authentication** → `security-rules.md`
7. **New Feature** → Start with `structure-rules.md`

## Rule File Structure

Each rule file follows this pattern:
```markdown
# Rule Name

## Quick Reference
**When to use**: Brief description of when this applies

## Core Rules
- Key patterns and examples
- Code snippets with ✅/❌ indicators
- Essential checklists

## Common Patterns
- Frequently used patterns
- Real examples from the codebase

## Quick Checklist
- [ ] Essential items to verify
- [ ] Before considering work complete

---
*Cross-references to related rule files*
```

## Benefits of This Approach

### For AI Context Management
- **Reduced Token Usage**: Only load relevant rules
- **Faster Responses**: AI focuses on specific patterns
- **Better Accuracy**: Less context noise, more relevant guidance

### For Project Maintenance
- **Easier Updates**: Modify specific rule categories
- **Better Organization**: Logical grouping of related patterns
- **Scalable**: Add new rule types as project evolves

### For Team Onboarding
- **Clear Learning Path**: Start with core rules, expand as needed
- **Task-Specific Guidance**: Find relevant patterns quickly
- **Consistent Patterns**: Everyone follows the same rules

## Adding New Rules

1. **Identify the category** (core, architecture, quality, etc.)
2. **Create focused rule file** with specific patterns
3. **Update main index** with new reference
4. **Cross-reference** related rule files
5. **Test with AI** to ensure clarity

---

*This modular approach makes the rules more accessible and efficient for both AI assistants and human developers.* 