# Portfolio Application

A modern, AI-powered portfolio application built with Next.js and Node.js, featuring intelligent search, interactive chat, and comprehensive content management capabilities.

## Project Overview

This portfolio application consists of two main components:

- **Portfolio.Next**: A Next.js frontend application with AI-powered features
- **Portfolio.Node**: A Node.js backend API providing content management and AI services

## Architecture

The application follows a modern full-stack architecture:

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Node.js with Express.js, MongoDB, and AI services
- **AI Integration**: Ollama for language models, Qdrant for vector search
- **Authentication**: Multi-provider OAuth and OpenID Connect support
- **Real-time Features**: WebSocket communication for interactive chat

## Key Features

- **Content Management**: Blog posts, projects, career timeline, and custom pages
- **AI-Powered Search**: Semantic search across all content using vector embeddings
- **Interactive Chat**: Real-time AI chat with context awareness
- **Admin Dashboard**: Comprehensive content and user management interface
- **Multi-Provider Authentication**: OAuth and OIDC support for flexible authentication
- **Responsive Design**: Mobile-first design with dark mode support

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Start with Docker Compose
docker-compose up --build
```

### Local Development
```bash
# Backend (Portfolio.Node)
cd portfolio.node
npm install
npm run dev

# Frontend (Portfolio.Next)
cd portfolio.next
npm install
npm run dev
```

## Documentation

For detailed information about each component:

- **[Portfolio.Next README](portfolio.next/README.md)** - Frontend application documentation
- **[Portfolio.Node README](portfolio.node/README.md)** - Backend API documentation  
- **[OIDC Authentication Guide](README_OIDC.md)** - OpenID Connect setup and configuration

## Technology Stack

### Frontend
- Next.js 15, React 19, TypeScript
- Tailwind CSS for styling
- Jest for testing

### Backend
- Node.js, Express.js
- MongoDB with Mongoose ODM
- WebSocket for real-time communication
- Passport.js for authentication

### AI & Search
- Ollama for language models
- Qdrant for vector database
- Semantic search and embeddings

### Infrastructure
- Docker containerization
- Nginx reverse proxy
- OpenTelemetry for monitoring

This portfolio application demonstrates modern web development practices while providing an engaging platform for showcasing professional work and knowledge sharing.

