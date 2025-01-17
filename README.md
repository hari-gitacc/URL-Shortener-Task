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

You can run this project in two ways:

### Option 1: Using Docker (Recommended)

**Prerequisites:**
- Docker Desktop
- Git

**Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/hari-gitacc/URL-Shortener-Task.git

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Start with Docker
docker-compose up

# To stop the containers
docker-compose down

# To rebuild (if package.json changes)
docker-compose up --build
```

### Option 2: Traditional Setup

**Prerequisites:**
- Node.js (v18+)
- MongoDB
- Redis
- Google OAuth credentials

**Steps:**

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Start the development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and update the following variables:

```env
MONGODB_URI=your_mongodb_uri
REDIS_HOST=your_redis_host
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
BASE_URL=your_base_url
```

## Deployment Details

### Docker Configuration

The application uses three containerized services:
- **Node.js Application:** API server
- **MongoDB:** Database
- **Redis:** Caching & Rate Limiting

## Deployment Details

### Production Deployment
Currently deployed on Render:
- Containerized using Docker
- URL: [URL Shortener](https://url-shortener-jjly.onrender.com)
- Environment: Production
- Database: MongoDB Atlas (External)
- Cache: Redis Cloud (External)

## API Documentation

Access the API documentation at `https://url-shortener-jjly.onrender.com/api-docs` when running the server.

### Key Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /api/shorten/{alias}` - Access the short URL
- `GET /api/analytics/{alias}` - View URL analytics
- `GET /api/analytics/topic/{topic}` - View topic analytics
- `GET /api/analytics/overall` - View overall analytics

## Development Notes

- Code changes automatically reflect with the Docker setup.
- No need to run `npm install` locally when using Docker.
- MongoDB data persists between container restarts.
- Local development supports hot reloading.

## Testing

Run the tests with the following command:

```bash
npm test
```

