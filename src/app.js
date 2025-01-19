// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();


// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const swaggerDocs = require('./config/swagger');
const analytics = require('./models/analytics');
const url = require('./models/url');
const connectDB = require('./config/db');
const trimParams = require('./middleware/trimParams');

// Initialize express app
const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "accounts.google.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        frameSrc: ["'self'", "accounts.google.com"],
        formAction: ["'self'", "accounts.google.com"]
      }
    }
  })
);
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
connectDB()


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// src/app.js
if (process.env.NODE_ENV !== 'production') {
  const testIpMiddleware = require('./middleware/testIp');
  app.use(testIpMiddleware);
}

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Import passport config
require('./config/passport');

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the URL-shortener API</h1>
    <p>To view the API documentation, please visit <a href="/api-docs">/api-docs</a>.</p>
  `);
});

app.use('/api/auth', authRoutes);
app.use('/api/shorten', urlRoutes);
app.use('/api/analytics', analyticsRoutes);


// Test route
app.get('/test-trim/:param', trimParams, (req, res) => {
  res.json({ param: req.params.param });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;


if (process.env.NODE_ENV !== 'test') {

  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });


  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });
}

module.exports = app;
