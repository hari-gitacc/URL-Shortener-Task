// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
require('dotenv').config();


// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const swaggerDocs = require('./config/swagger');
const analytics = require('./models/analytics');
const url = require('./models/url');
const connectDB = require('./config/db');

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

app.delete('/delete-all', async (req, res) => {
  try {
    const resultAnalytics = await analytics.deleteMany({});
    const resultUrl = await url.deleteMany({});
    res.json({
      message: 'Documents deleted successfully',
      analyticsDeleted: resultAnalytics.deletedCount,
      urlDeleted: resultUrl.deletedCount
    });
  } catch (error) {
    res.status(500).send('Error deleting documents: ' + error.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
module.exports = app;
