
`ARCHITECTURE.md`:
```markdown
# URL Shortener Architecture Documentation

## 1. System Overview

### Core Components
- Node.js/Express backend service
- MongoDB for data persistence
- Redis for caching and rate limiting
- Google OAuth authentication
- IP2Location.io for geolocation tracking

### Key Features
- URL shortening with custom aliases
- Topic-based URL organization
- Comprehensive analytics
- Rate limiting protection
- Distributed caching

## 2. Database Design

### Users Collection
```javascript
{
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  picture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### URLs Collection
```javascript
{
  userEmail: {   
    type: String,
    ref: 'User',
    required: true
  },
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  },
  customAlias: String,
  topic: {
    type: String,
    enum: ['acquisition', 'activation', 'retention'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Analytics Collection
```javascript
{
  urlId: {
    type: ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  device: String,
  os: String,
  browser: String,
  location: {
    ip: String,
    country_code: String,
    country_name: String,
    region_name: String,
    city_name: String,
    latitude: Number,
    longitude: Number,
    zip_code: String,
    time_zone: String,
    asn: String,
    as: String,
    is_proxy: Boolean
  }
}
```

## 3. Service Implementations

### Rate Limiting System
```javascript
// Hourly limit (50 URLs per hour)
const hourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user.email,
  handler: async (req, res) => {
    const client = await redisManager.getClient();
    const key = `ratelimit:${req.user.email}`;
    await client.incr(key);
    await client.expire(key, 3600);
    res.status(429).json({
      error: 'URL creation limit exceeded. You can create up to 50 URLs per hour.'
    });
  }
});

// Burst limit (5 URLs per minute)
const burstLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user.email,
  handler: async (req, res) => {
    const client = await redisManager.getClient();
    const key = `burstlimit:${req.user.email}`;
    await client.incr(key);
    await client.expire(key, 60);
    res.status(429).json({
      error: 'Please wait a moment before creating more URLs.'
    });
  }
});
```

### Caching System
```javascript
// URL Caching
const urlCache = {
  key: (shortUrl) => `url:${shortUrl}`,
  ttl: 3600, // 1 hour
};

// Analytics Caching
const analyticsCache = {
  key: (shortUrl) => `analytics:${shortUrl}`,
  ttl: 300, // 5 minutes
};
```

### Geolocation System
```javascript
const getLocationFromIP = async (ip) => {
  const BASE_URL = "https://api.ip2location.io/";
  const params = new URLSearchParams({
    key: process.env.IP2LOCATION_KEY,
    ip: ip,
  });
  
  const url = `${BASE_URL}?${params.toString()}`;
  // Full location data with error handling
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
};
```

## 4. Docker Configuration

### Development Environment
```yaml
services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/url-shortener
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    command: npm run dev

  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:alpine

volumes:
  mongodb_data:
```

### Production Environment
```yaml
services:
  app:
    build: .
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    command: npm start
```

## 5. Error Handling

### API Error Responses
- 400: Bad Request (Invalid input)
- 401: Unauthorized (Authentication required)
- 404: Not Found (URL not found)
- 429: Too Many Requests (Rate limit exceeded)
- 500: Internal Server Error

### Error Recovery
- Redis connection retry
- MongoDB reconnection strategy
- IP2Location API fallback

## 6. Security Measures

### Authentication
- Google OAuth 2.0
- JWT token validation
- Session management

### API Protection
- Rate limiting
- Input validation
- Request sanitization

## 7. Analytics Implementation

### Data Collection
- IP address tracking
- User agent parsing
- Geolocation lookup
- Device detection
- Click timestamp recording

### Data Aggregation
- 7-day click history
- Unique visitor counting
- Geographic distribution
- OS/Device statistics
- Topic-based metrics

## 8. Testing Strategy

### Required Tests
- URL operations
- Rate limiting
- Analytics tracking
- Authentication flow
- Cache operations

### Test Coverage
- Unit tests for services
- Integration tests for API
- Analytics validation

## 9. Potential Improvements

### Performance Optimizations
- Implement sharding for MongoDB to handle larger datasets
- Add a CDN for global request distribution
- Implement request queueing for analytics processing
- Add batch processing for analytics data collection
- Optimize database indices for faster query performance

### Scalability Enhancements
- Implement horizontal scaling with load balancing
- Add database read replicas for analytics queries
- Introduce message queues for asynchronous processing
- Set up master-slave Redis configuration for failover
- Implement database partitioning by date ranges

### Feature Additions
- Add QR code generation for short URLs
- Implement URL expiration functionality
- Add custom domain support for short URLs
- Implement URL preview functionality
- Add webhook notifications for URL analytics
- Introduce A/B testing capabilities for different short URLs
- Add support for campaign tracking parameters

### Security Improvements
- Implement rate limiting by IP address in addition to user
- Add CAPTCHA verification for URL creation
- Implement URL scanning for malicious content
- Add two-factor authentication option
- Implement IP allowlisting/blocklisting
- Add audit logging for all administrative actions

### Analytics Enhancements
- Implement real-time analytics with WebSocket
- Add heat maps for geographical data visualization
- Implement custom analytics dashboards
- Add export functionality for analytics data
- Implement advanced filtering and search in analytics
- Add conversion tracking capabilities
- Implement custom event tracking

### Monitoring and Maintenance
- Add comprehensive system health monitoring
- Implement automated backup solutions
- Add performance metrics tracking
- Implement automated scaling triggers
- Add detailed error tracking and reporting
- Set up automated security vulnerability scanning

### Developer Experience
- Implement GraphQL API alongside REST
- Add SDK libraries for popular programming languages
- Improve API documentation with more examples
- Add development environment setup scripts
- Implement CI/CD pipeline improvements

### Testing Improvements
- Add load testing scenarios
- Implement chaos testing
- Add end-to-end testing suite
- Implement performance regression testing
- Add automated security testing

### API Endpoints

#### URL Management
- `POST /api/shorten` - Create short URL
- `GET /api/shorten/{alias}` - Access short URL

#### Analytics
- `GET /api/analytics/{alias}` - URL analytics
- `GET /api/analytics/topic/{topic}` - Topic analytics
- `GET /api/analytics/overall` - Overall analytics

### Development Notes
- Development environment features hot reloading
- Docker setup mounts local files for live code changes
- MongoDB data persists between container restarts
- Redis cache clears on container restart

### Testing
```bash
# Run tests
npm test
```

### API Documentation
Access Swagger documentation at `/api-docs` when running the server.
```
