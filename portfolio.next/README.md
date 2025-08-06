# Portfolio.Next

A modern, AI-powered portfolio application built with Next.js 15, React 19, and TypeScript. This application serves as a comprehensive personal portfolio showcasing projects, blog posts, career timeline, and interactive features powered by artificial intelligence.

## Application Overview

Portfolio.Next is a full-stack portfolio application that combines traditional portfolio features with modern AI capabilities. The application provides a platform for showcasing professional work, sharing knowledge through blog posts, and engaging with visitors through intelligent chat and search functionality.

## Core Features

### Content Management
- **Blog Posts**: Create, edit, and manage blog entries with markdown support, tags, and draft/publish workflow
- **Projects**: Showcase projects with detailed descriptions, technologies used, status tracking, and external links
- **Career Timeline**: Interactive timeline displaying professional experience with company details, skills, and descriptions
- **Custom Pages**: Create and manage custom content pages with full markdown support

### AI-Powered Features
- **Intelligent Search**: Semantic search across all content including blogs, projects, and files using AI embeddings
- **Interactive Chat**: Real-time chat interface powered by WebSocket connections and AI models
- **Content Recommendations**: AI-driven content suggestions and contextual responses
- **Embedding Management**: Automatic generation and management of AI embeddings for enhanced search capabilities

### User Experience
- **Responsive Design**: Mobile-first design with adaptive layouts for all screen sizes
- **Dark Mode Support**: Complete dark/light theme implementation
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized**: Server-side rendering, static generation, and optimized loading

### Administrative Features
- **Admin Dashboard**: Comprehensive management interface for all content and settings
- **User Management**: Create, edit, and manage user accounts with role-based permissions
- **Analytics**: Track page views, user interactions, and performance metrics
- **File Management**: Upload and manage global files for AI context and content
- **OAuth Integration**: Support for external authentication providers (Google, Facebook, OIDC)

## Technical Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router and server-side rendering
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Jest & Testing Library**: Comprehensive testing suite

### Key Components
- **Context Providers**: Authentication, chat, search, and loading state management
- **Service Layer**: API integration and data management
- **Model Definitions**: TypeScript interfaces for all data structures
- **Custom Hooks**: Reusable logic for WebSocket connections and state management

### Data Models

#### BlogEntry
- Title, excerpt, and full body content
- Tags for categorization
- Draft/publish workflow
- SEO-friendly link generation
- Creation and update timestamps

#### Project
- Project details with status tracking
- Technology stack and industry information
- External links and image support
- Start/end date management
- Visibility controls

#### CareerTimeline
- Professional experience entries
- Company and location information
- Skills and technology tags
- Timeline ordering and visibility
- External links and references

### API Integration
The application connects to a Node.js backend API providing:
- RESTful endpoints for all content management
- WebSocket support for real-time chat
- Authentication and authorization
- AI model integration
- File upload and management

## Content Structure

### Public Pages
- **Home**: Featured blog posts and projects with search functionality
- **Blogs**: Individual blog post pages with markdown rendering
- **Projects**: Detailed project showcases with technology information
- **Career**: Interactive timeline of professional experience
- **Custom Pages**: Dynamic content pages with full markdown support

### Admin Interface
- **Dashboard**: Overview of all content and system status
- **Content Management**: CRUD operations for blogs, projects, and pages
- **User Management**: Account administration and role management
- **Settings**: AI model configuration and system preferences
- **Analytics**: Performance metrics and user behavior tracking

## Search and Discovery

The application features a sophisticated search system that combines:
- Traditional keyword-based search
- AI-powered semantic search using embeddings
- Real-time search suggestions
- Filtered results by content type
- Relevance scoring and ranking

## Chat System

The interactive chat feature provides:
- Real-time messaging via WebSocket connections
- AI-powered responses using configured language models
- Context-aware conversations based on portfolio content
- Message history and session management
- Markdown rendering for rich responses

## Security and Authentication

- Role-based access control (Admin/User)
- OAuth 2.0 integration for external providers
- Session management and secure cookies
- Protected admin routes and API endpoints
- Input validation and sanitization

## Performance Features

- Server-side rendering for improved SEO
- Static generation for content pages
- Optimized image loading and caching
- Lazy loading of components and content
- Efficient state management and updates

## Development and Testing

The application includes comprehensive testing infrastructure:
- Unit tests for components and services
- Integration tests for API endpoints
- End-to-end testing capabilities
- Jest configuration with TypeScript support
- Testing utilities and mock data

This portfolio application represents a modern approach to personal branding and content management, combining traditional portfolio features with cutting-edge AI capabilities to create an engaging and interactive experience for visitors.
