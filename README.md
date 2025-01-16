# Advanced URL Shortener with Analytics

A scalable URL shortening service with comprehensive analytics, custom aliases, rate limiting, and Google authentication.

## Live Demo
[URL Shortener Demo](https://url-shortener-task-production.up.railway.app)

## Features Overview

### Core Features
1. **URL Shortening**
   - Custom alias support
   - Auto-generated short URLs
   - Topic categorization (acquisition/activation/retention)
   - Rate limiting (50 URLs/hour, 5 URLs/minute)

2. **Authentication**
   - Google OAuth 2.0 integration
   - JWT-based authorization
   - Secure session management

3. **Analytics**
   - Click tracking
   - Unique visitor counting
   - Geographic data
   - OS and device statistics
   - Time-based analytics
   - Topic-based grouping

4. **Performance Optimizations**
   - Redis caching
   - Rate limiting
   - MongoDB for scalable storage

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Google OAuth credentials

### Local Development
```bash
# Clone repository
git clone <your-repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev