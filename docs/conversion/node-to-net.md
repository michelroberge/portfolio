# Node.js to .NET Conversion Documentation

## Project Analysis

### Current Node.js Stack
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- Vector Search: Qdrant
- Authentication: Passport.js (Multiple providers)
- File Processing: grid-fs, pdf-parse
- Validation: Joi
- Testing: Jest
- Caching: node-cache
- Monitoring: OpenTelemetry

### Architecture Analysis
The current Node.js project follows a basic layered architecture but lacks strict boundaries:
- Routes (API endpoints in /routes)
- Middlewares (Authentication, Validation, Metrics)
- Services (Business Logic with direct model dependencies)
- Models (Mongoose schemas with embedded business logic)
- Utils (Helper Functions)

Key Architectural Issues:
1. Business logic mixed with data models (Mongoose schemas)
2. Direct dependencies between layers
3. Lack of clear domain boundaries
4. Missing interface abstractions
5. Mixed concerns in service layer

## .NET Clean Architecture Implementation

### Core Principles
1. Dependency Inversion
2. Interface Segregation
3. Single Responsibility
4. Domain-Driven Design
5. Hexagonal Architecture

### Project Structure
```
portfolio.net/
├── src/
│   ├── Domain/              # Domain Layer
│   │   ├── Entities/                  # Domain entities
│   │   ├── Interfaces/                # Core interfaces
│   │   ├── Events/                    # Domain events
│   │   └── ValueObjects/              # Value objects
│   │
│   ├── Application/         # Application Layer
│   │   ├── Common/                    # Shared DTOs, mappings
│   │   ├── Interfaces/                # Port interfaces
│   │   ├── Services/                  # Application services
│   │   └── UseCases/                  # CQRS handlers
│   │
│   ├── Infrastructure/      # Infrastructure Layer
│   │   ├── Persistence/              # Data access
│   │   ├── Identity/                 # Auth implementation
│   │   ├── Search/                   # Qdrant implementation
│   │   ├── AI/                       # Ollama implementation
│   │   └── External/                 # External services
│   │
│   └── Api/             # API Layer
│       ├── Controllers/              # API endpoints
│       ├── Middleware/               # Request pipeline
│       ├── Configuration/            # App settings
│       └── DependencyInjection/      # IoC setup
│
└── tests/
    ├── Domain.Tests/        # Domain unit tests
    ├── Application.Tests/    # Application tests
    ├── Infrastructure.Tests/ # Infrastructure tests
    └── Api.Tests/        # API integration tests

### Component Mapping

#### Domain Entities
| Node.js Model | .NET Entity | Interface |
|---------------|-------------|-----------|
| BlogEntry | Blog | IBlog |
| CareerTimeline | Career | ICareer |
| ChatMessage | Chat | IChat |
| Comment | Comment | IComment |
| Embedding | Embedding | IEmbedding |
| Page | Page | IPage |
| Project | Project | IProject |
| Prompt | Prompt | IPrompt |
| ProviderConfig | Provider | IProvider |
| User | User | IUser |

#### Core Services
| Node.js Service | .NET Service | Interface |
|-----------------|--------------|-----------|
| authService | AuthenticationService | IAuthenticationService |
| blogService | BlogService | IBlogService |
| chatService | ChatService | IChatService |
| embeddingService | EmbeddingService | IEmbeddingService |
| fileService | FileService | IFileService |
| projectService | ProjectService | IProjectService |
| searchService | SearchService | ISearchService |

#### Infrastructure Adapters
| Node.js Component | .NET Adapter | Interface |
|------------------|--------------|-----------|
| MongoDB Connection | MongoDbContext | IApplicationDbContext |
| Qdrant Client | QdrantSearchAdapter | IVectorSearchAdapter |
| Passport Strategies | IdentityProvider | IIdentityProvider |
| Cache Service | DistributedCacheService | ICacheService |

#### API Routes to Controllers
| Node.js Route | .NET Controller | Base Route |
|---------------|-----------------|------------|
| authRoutes | AuthController | /api/auth |
| blogRoutes | BlogController | /api/blogs |
| projectRoutes | ProjectController | /api/projects |
| chatRoutes | ChatController | /api/chat |
| searchRoutes | SearchController | /api/search |
| fileRoutes | FileController | /api/files |
| adminRoutes | AdminController | /api/admin |

## Implementation Guidelines

### Domain Layer
- Each entity must be immutable
- Use value objects for complex attributes
- Define domain events for state changes
- Implement domain services for complex business logic

### Application Layer
- Implement CQRS pattern for operations
- Use MediatR for command/query handling
- Implement validation using FluentValidation
- Use AutoMapper for object mapping

### Infrastructure Layer
- Implement repository pattern
- Use Unit of Work pattern
- Implement proper connection management
- Handle distributed caching

### API Layer
- Implement proper exception handling
- Use API versioning
- Implement proper authentication/authorization
- Use proper response types

## Progress Tracking

- [ ] Domain Layer Implementation
  - [ ] Core entities
  - [ ] Value objects
  - [ ] Domain events
  - [ ] Domain services

- [ ] Application Layer Implementation
  - [ ] DTOs and mappings
  - [ ] CQRS handlers
  - [ ] Validation rules
  - [ ] Application services

- [ ] Infrastructure Layer Implementation
  - [ ] MongoDB integration
  - [ ] Qdrant integration
  - [ ] Identity implementation
  - [ ] Cache implementation

- [ ] API Layer Implementation
  - [ ] Controllers
  - [ ] Middleware
  - [ ] Authentication
  - [ ] Documentation

- [ ] Testing
  - [ ] Domain unit tests
  - [ ] Application tests
  - [ ] Infrastructure tests
  - [ ] Integration tests
