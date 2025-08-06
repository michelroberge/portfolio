# Portfolio.Node

A comprehensive Node.js backend API for the Portfolio.Next application, providing robust content management, AI-powered features, authentication, and real-time communication capabilities. Built with Express.js, MongoDB, and modern AI services.

## Application Overview

Portfolio.Node serves as the backend infrastructure for a modern portfolio application, offering RESTful APIs, WebSocket communication, AI integration, and comprehensive content management. The application supports both traditional portfolio features and cutting-edge AI capabilities including semantic search, intelligent chat, and automated content processing.

## Core Features

### Content Management APIs
- **Blog Management**: Full CRUD operations for blog entries with markdown support, draft/publish workflow, and SEO optimization
- **Project Management**: Project showcase capabilities with technology tracking, status management, and external link handling
- **Career Timeline**: Professional experience management with company details, skills tracking, and timeline ordering
- **Custom Pages**: Dynamic page creation and management with full markdown support
- **File Management**: Global file storage and management for AI context and content assets

### AI-Powered Services
- **Semantic Search**: Vector-based search using Qdrant vector database with embedding generation
- **Intelligent Chat**: Real-time chat system with AI-powered responses and context awareness
- **Content Embeddings**: Automatic generation and management of AI embeddings for enhanced search
- **LLM Integration**: Ollama-based language model integration with streaming support
- **Prompt Management**: Configurable prompt templates for AI interactions

### Authentication & Authorization
- **Multi-Provider OAuth**: Support for Google, Facebook, GitHub, and Microsoft authentication
- **OIDC Integration**: OpenID Connect support for enterprise authentication
- **Role-Based Access Control**: Admin and user role management with secure permissions
- **Session Management**: Secure session handling with MongoDB storage
- **JWT Support**: Token-based authentication for API access

### Real-Time Communication
- **WebSocket Server**: Real-time chat functionality with streaming AI responses
- **Session Management**: Persistent chat sessions with history tracking
- **Message Logging**: Comprehensive logging of chat interactions for analytics

### Administrative Features
- **User Management**: Complete user administration with role assignment
- **Analytics Tracking**: Page views, user interactions, and performance metrics
- **Provider Configuration**: Dynamic OAuth provider setup and management
- **System Monitoring**: Request logging, error tracking, and performance monitoring

## Technical Architecture

### Backend Stack
- **Node.js**: Runtime environment with Express.js framework
- **MongoDB**: Document database with Mongoose ODM
- **WebSocket**: Real-time communication using ws library
- **Passport.js**: Authentication middleware with multiple strategies
- **Joi**: Request validation and data sanitization

### AI & Machine Learning
- **Ollama**: Local LLM integration for AI responses
- **Qdrant**: Vector database for semantic search and embeddings
- **Embedding Services**: Text-to-vector conversion for search optimization
- **Pipeline Processing**: Multi-step AI processing workflows

### Data Models

#### BlogEntry
- Title, excerpt, and markdown body content
- Draft/publish workflow with scheduled publishing
- SEO-friendly link generation and vector ID assignment
- Tag categorization and metadata management
- Creation and update timestamps

#### Project
- Project details with status tracking (planned, in-progress, completed, on-hold)
- Technology stack and industry classification
- External links and image support
- Vector embedding for semantic search
- Visibility controls and publication management

#### User
- Username and password authentication
- Admin role assignment and permissions
- OAuth provider integration
- OIDC support for enterprise environments
- Secure password hashing with bcrypt

#### CareerTimeline
- Professional experience entries with company details
- Skills and technology tracking
- Timeline ordering and visibility controls
- External links and references
- Vector embedding for search optimization

### API Structure

#### Public Endpoints
- `/api/blogs` - Blog post retrieval and search
- `/api/projects` - Project showcase and filtering
- `/api/pages` - Custom page content
- `/api/career` - Career timeline data
- `/api/search` - Semantic search across all content
- `/api/files` - Public file access

#### Authentication Endpoints
- `/api/auth` - Login, logout, and session management
- `/api/auth/oauth2` - OAuth provider authentication flows
- `/api/comments` - User comment management
- `/api/chat` - Chat session management

#### Admin Endpoints
- `/api/admin/blogs` - Blog content management
- `/api/admin/projects` - Project administration
- `/api/admin/users` - User management and role assignment
- `/api/admin/ai` - AI model configuration and management
- `/api/admin/embeddings` - Vector database management
- `/api/admin/analytics` - System metrics and performance data

### Service Layer Architecture

#### Core Services
- **BlogService**: Blog entry CRUD operations and content processing
- **ProjectService**: Project management with status tracking
- **UserService**: User administration and authentication
- **FileService**: File upload, storage, and retrieval
- **CommentService**: Comment moderation and management

#### AI Services
- **LLMService**: Language model integration and prompt management
- **OllamaService**: Direct Ollama API communication with streaming
- **QdrantService**: Vector database operations and semantic search
- **EmbeddingService**: Text embedding generation and management
- **PipelineService**: Multi-step AI processing workflows

#### Communication Services
- **WSChatService**: WebSocket server management and real-time chat
- **ChatService**: Chat session handling and message processing
- **ChatbotRequestLogService**: Chat interaction logging and analytics

## Security Features

### Authentication & Authorization
- Multi-provider OAuth 2.0 integration
- OpenID Connect support for enterprise environments
- Role-based access control with admin/user roles
- Secure session management with MongoDB storage
- JWT token support for API authentication

### Data Protection
- Input validation and sanitization using Joi
- SQL injection prevention through Mongoose ODM
- XSS protection with proper content encoding
- CORS configuration for cross-origin requests
- Secure cookie handling and session management

### Monitoring & Logging
- OpenTelemetry integration for distributed tracing
- Request logging with IP tracking and user agent analysis
- Error tracking and performance monitoring
- Chat interaction logging for analytics
- Comprehensive audit trails for admin actions

## Performance Optimizations

### Database Optimization
- MongoDB indexing for efficient queries
- Connection pooling and connection management
- Aggregation pipelines for complex data operations
- Caching strategies for frequently accessed data

### AI Performance
- Vector database optimization for semantic search
- Streaming responses for real-time chat interactions
- Embedding caching to reduce computation overhead
- Batch processing for bulk operations

### API Performance
- Request validation and early error handling
- Efficient data serialization and response formatting
- Connection pooling for external service calls
- Rate limiting and request throttling

## Development & Testing

### Testing Infrastructure
- Jest testing framework with comprehensive test coverage
- MongoDB memory server for isolated testing
- Supertest for API endpoint testing
- Mock services for external dependencies
- Integration tests for complex workflows

### Development Tools
- Nodemon for development server with auto-restart
- ESLint for code quality and consistency
- Environment-specific configuration management
- Hot reloading for development efficiency
- Debug logging and error tracking

### Documentation
- Swagger/OpenAPI documentation for all endpoints
- Comprehensive API documentation with examples
- Code documentation and inline comments
- Architecture diagrams and service descriptions

## Integration Capabilities

### External Services
- Ollama for local AI model hosting
- Qdrant for vector database operations
- MongoDB Atlas for cloud database hosting
- OAuth providers (Google, Facebook, GitHub, Microsoft)
- OpenID Connect providers for enterprise integration

### Frontend Integration
- RESTful API endpoints for Next.js frontend
- WebSocket support for real-time features
- CORS configuration for cross-origin requests
- Session management for seamless user experience
- File upload and management for content assets

This backend application provides a robust, scalable foundation for modern portfolio applications, combining traditional content management with advanced AI capabilities to create an engaging and intelligent user experience. 