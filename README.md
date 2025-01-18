
# Advanced URL Shortener with Analytics

A scalable URL shortening service with comprehensive analytics, custom aliases, rate limiting, and Google authentication.

## Live Demo

[URL Shortener Demo](https://url-shortener-jjly.onrender.com)

## Features Overview

### Core Features

- **URL Shortening**
  - Custom alias support
  - Auto-generated short URLs
  - Topic categorization (acquisition/activation/retention)
  - Rate limiting (50 URLs/hour, 5 URLs/minute)

- **Authentication**
  - Google OAuth 2.0 integration
  - JWT-based authorization
  - Secure session management

- **Analytics**
  - Click tracking
  - Unique visitor counting
  - Geographic data
  - OS and device statistics
  - Time-based analytics
  - Topic-based grouping

- **Performance Optimizations**
  - Redis caching
  - Rate limiting
  - MongoDB for scalable storage
  - IP2Location.io API for accurate geolocation tracking


## Setup Instructions

### Prerequisites
- Docker Desktop
- Git
- Node.js (v18+) [for non-Docker setup]

### Option 1: Docker Setup (Recommended)

#### Development Environment
```bash
# Clone the repository
git clone https://github.com/hari-gitacc/URL-Shortener-Task.git

# Navigate to project directory
cd URL-Shortener-Task

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development environment with hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# To stop the containers
docker-compose down

# Rebuild containers (if dependencies change)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### Production Environment
```bash
# Start production environment
docker-compose up

# Stop production environment
docker-compose down
```

### Option 2: Local Setup (Without Docker)

```bash
# Clone the repository
git clone https://github.com/hari-gitacc/URL-Shortener-Task.git

# Navigate to project directory
cd URL-Shortener-Task

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server 
npm run dev

# Start production server
npm start
```

## Environment Variables

Create `.env` file from `.env.example`:

```env
MONGODB_URI=your_mongodb_uri
REDIS_HOST=your_redis_host
REDIS_PORT=6379
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
BASE_URL=your_base_url
SESSION_SECRET=your_session_secret
IP2LOCATION_KEY=your_key
```

## API Documentation

The API is fully documented using Swagger/OpenAPI specification. Access the interactive Swagger documentation at `/api-docs` when running the server.

### Key Endpoints

#### URL Operations
- `POST /api/shorten` 
  - Create a short URL
  - Requires authentication
  - Supports custom aliases and topic categorization
  - Rate limited (50/hour, 5/minute per user)

- `GET /api/shorten/{alias}` 
  - Access the short URL
  - Public endpoint
  - Tracks analytics automatically

#### Analytics Operations
- `GET /api/analytics/{alias}`
  - View detailed URL analytics
  - Requires authentication
  - Shows clicks, unique visitors, and geographic data

- `GET /api/analytics/topic/{topic}`
  - View topic-based analytics
  - Requires authentication
  - Topics: acquisition, activation, retention

- `GET /api/analytics/overall`
  - View overall analytics for all URLs
  - Requires authentication
  - Comprehensive statistics and trends

### Swagger UI Features
- Interactive API testing interface
- Request/response examples
- Authentication documentation
- Schema definitions
- Rate limit information

Access the full API documentation and testing interface at: 

https://url-shortener-jjly.onrender.com/api-docs

## Development Notes

- Development environment features hot reloading
- Docker setup mounts local files for live code changes
- MongoDB data persists between container restarts
- Redis cache clears on container restart

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/url.test.js
```

## Deployment

Currently deployed on Render:
- URL: [https://url-shortener-jjly.onrender.com](https://url-shortener-jjly.onrender.com)
- Using Docker containerization
- MongoDB Atlas for database
- Redis Cloud for caching


## Technical Challenges and Solutions

### 1. Docker Implementation Learning Curve
**Challenge:** New to Docker containerization and faced issues with development workflow  
**Solution:** 
- Implemented Docker volumes to enable live code changes without rebuilding
- Created separate development and production configurations
- Learned container networking and service orchestration with Docker Compose
- Successfully configured multi-container setup with Node.js, MongoDB and Redis

### 2. Geolocation Implementation
**Challenge:** Needed accurate location data from IP addresses for analytics  
**Solution:** Integrated IP2Location.io API which provides reliable geolocation data including city, region, and country information for each URL visit

### 3. Redis Integration with Docker 
**Challenge:** Setting up Redis to work correctly within Docker containers  
**Solution:** Configured Redis service in Docker Compose with proper networking and persistence, ensuring reliable caching across container restarts

### 4. Rate Limiting
**Challenge:** Implementing rate limiting for URL creation (50/hour and 5/minute)  
**Solution:** Used Redis to track request counts with appropriate expiry times, allowing accurate limiting across multiple requests

### 5. Google OAuth Integration
**Challenge:** Implementing secure authentication flow with Google OAuth  
**Solution:** Created a robust authentication system using Google OAuth 2.0 with JWT tokens for session management

### 6. Analytics Data Structure
**Challenge:** Designing an efficient schema for storing and retrieving analytics data  
**Solution:** Structured MongoDB schema to efficiently track visits, user agents, and geolocation data while maintaining query performance for analytics endpoints
