# API Routes Documentation

## Authentication Levels
- **None**: Publicly accessible endpoints
- **User**: Requires valid authentication token
- **Admin**: Requires valid authentication token and admin role

## Public Routes

### Authentication
- **POST** `/api/auth/register`
  - Auth: None
  - Description: Register a new user
  - Parameters:
    - `username` (string)
    - `password` (string)

- **POST** `/api/auth/login`
  - Auth: None
  - Description: Authenticate user and receive token
  - Parameters:
    - `username` (string)
    - `password` (string)

- **GET** `/api/auth/status`
  - Auth: None
  - Description: Check authentication status and setup requirement
  - Parameters: None

- **GET** `/api/auth/logout`
  - Auth: None
  - Description: Clear authentication token
  - Parameters: None

### Blogs
- **GET** `/api/blogs`
  - Auth: None
  - Description: Retrieve all published blog posts
  - Parameters: None

- **GET** `/api/blogs/search`
  - Auth: None
  - Description: Search published blog posts
  - Parameters:
    - `q` (query string)
    - `limit` (optional, default: 10)
    - `minScore` (optional, default: 0.7)

- **GET** `/api/blogs/:id`
  - Auth: None
  - Description: Retrieve a single published blog post
  - Parameters:
    - `id` (path parameter)

### Projects
- **GET** `/api/projects`
  - Auth: None
  - Description: Retrieve all published projects
  - Parameters: None

- **POST** `/api/projects/search`
  - Auth: None
  - Description: Search projects using hybrid search
  - Parameters:
    - `query` (string)
    - `limit` (optional)
    - `minScore` (optional)

### Career Timeline
- **GET** `/api/career`
  - Auth: None
  - Description: Get career timeline entries
  - Parameters: None

### Pages
- **GET** `/api/pages/:slug`
  - Auth: None
  - Description: Get page content by slug
  - Parameters:
    - `slug` (path parameter)

### Files
- **GET** `/api/files/:filename`
  - Auth: None
  - Description: Get file by filename
  - Parameters:
    - `filename` (path parameter)

### Search
- **POST** `/api/search`
  - Auth: None
  - Description: Global search across all entities
  - Parameters:
    - `query` (string)
    - `limit` (optional)
    - `minScore` (optional)

### Chat
- **POST** `/api/chat`
  - Auth: None
  - Description: Process chat message
  - Parameters:
    - `sessionId` (string)
    - `query` (string)
    - `history` (optional, array)
    - `webContext` (optional, string)

- **GET** `/api/chat`
  - Auth: None
  - Description: Get chat history
  - Parameters:
    - `sessionId` (query parameter)

- **GET** `/api/chat/greeting`
  - Auth: None
  - Description: Get random AI greeting
  - Parameters: None

- **GET** `/api/chat/warmup-status`
  - Auth: None
  - Description: Check if AI warmup is complete
  - Parameters: None

## User Authenticated Routes

### Comments
- **POST** `/api/comments`
  - Auth: User
  - Description: Create a new comment
  - Parameters: Comment data in body

## Admin Routes

### Blog Management
- **GET** `/api/admin/blogs`
  - Auth: Admin
  - Description: Get all blog posts (including drafts and future posts)
  - Parameters: None

- **GET** `/api/admin/blogs/:id`
  - Auth: Admin
  - Description: Get a specific blog post
  - Parameters:
    - `id` (path parameter)

- **POST** `/api/admin/blogs`
  - Auth: Admin
  - Description: Create a new blog post
  - Parameters: Blog data in body

- **PUT** `/api/admin/blogs/:id`
  - Auth: Admin
  - Description: Update a blog post
  - Parameters:
    - `id` (path parameter)
    - Blog data in body

- **DELETE** `/api/admin/blogs/:id`
  - Auth: Admin
  - Description: Delete a blog post
  - Parameters:
    - `id` (path parameter)

### Project Management
- **GET** `/api/admin/projects`
  - Auth: Admin
  - Description: Get all projects (including drafts and future posts)
  - Parameters: None

- **GET** `/api/admin/projects/:id`
  - Auth: Admin
  - Description: Get a specific project
  - Parameters:
    - `id` (path parameter)

- **POST** `/api/admin/projects`
  - Auth: Admin
  - Description: Create a new project
  - Parameters: Project data in body

- **PUT** `/api/admin/projects/:id`
  - Auth: Admin
  - Description: Update a project
  - Parameters:
    - `id` (path parameter)
    - Project data in body

- **DELETE** `/api/admin/projects/:id`
  - Auth: Admin
  - Description: Delete a project
  - Parameters:
    - `id` (path parameter)

### Provider Configuration
- **GET** `/api/admin/provider-config`
  - Auth: Admin
  - Description: Get all provider configurations
  - Parameters: None

- **POST** `/api/admin/provider-config`
  - Auth: Admin
  - Description: Create/Update provider configuration
  - Parameters: Provider config data in body

- **DELETE** `/api/admin/provider-config/:id`
  - Auth: Admin
  - Description: Delete provider configuration
  - Parameters:
    - `id` (path parameter)

### Career Timeline Management
- **GET** `/api/admin/career`
  - Auth: Admin
  - Description: Get all career entries (including drafts and future posts)
  - Parameters: None

- **GET** `/api/admin/career/:id`
  - Auth: Admin
  - Description: Get a specific career entry
  - Parameters:
    - `id` (path parameter)

- **POST** `/api/admin/career`
  - Auth: Admin
  - Description: Create career timeline entry
  - Parameters: Career entry data in body

- **PUT** `/api/admin/career/:id`
  - Auth: Admin
  - Description: Update career timeline entry
  - Parameters:
    - `id` (path parameter)
    - Career entry data in body

- **DELETE** `/api/admin/career/:id`
  - Auth: Admin
  - Description: Delete career timeline entry
  - Parameters:
    - `id` (path parameter)

### Page Management
- **GET** `/api/admin/pages`
  - Auth: Admin
  - Description: Get all pages (including drafts)
  - Parameters: None

- **GET** `/api/admin/pages/:id`
  - Auth: Admin
  - Description: Get a specific page
  - Parameters:
    - `id` (path parameter)

- **POST** `/api/admin/pages`
  - Auth: Admin
  - Description: Create a new page
  - Parameters: Page data in body

- **PUT** `/api/admin/pages/:id`
  - Auth: Admin
  - Description: Update a page
  - Parameters:
    - `id` (path parameter)
    - Page data in body

- **DELETE** `/api/admin/pages/:id`
  - Auth: Admin
  - Description: Delete a page
  - Parameters:
    - `id` (path parameter)

### File Management
- **GET** `/api/admin/files`
  - Auth: Admin
  - Description: Get all files
  - Parameters: None

- **GET** `/api/admin/files/:filename`
  - Auth: Admin
  - Description: Get specific file details
  - Parameters:
    - `filename` (path parameter)

- **POST** `/api/admin/files/upload`
  - Auth: Admin
  - Description: Upload file
  - Parameters: File data (multipart/form-data)

- **DELETE** `/api/admin/files/:filename`
  - Auth: Admin
  - Description: Delete file
  - Parameters:
    - `filename` (path parameter)
