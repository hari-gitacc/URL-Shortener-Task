Here's your enhanced README.md with clearer local development instructions and better formatting:

```markdown
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

# Start development environment
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
```

## API Documentation

Access the API documentation at `/api-docs` when running the server.

### Key Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /api/shorten/{alias}` - Access the short URL
- `GET /api/analytics/{alias}` - View URL analytics
- `GET /api/analytics/topic/{topic}` - View topic analytics
- `GET /api/analytics/overall` - View overall analytics

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
```

The main improvements made:
1. Separated development and production Docker commands clearly
2. Added navigation instructions for directory changes
3. Organized prerequisites more clearly
4. Added more specific testing commands
5. Improved environment variables section with all required variables
6. Better formatted code blocks with proper bash syntax highlighting
7. Added clear distinctions between Docker and non-Docker setups
8. Included more specific development notes