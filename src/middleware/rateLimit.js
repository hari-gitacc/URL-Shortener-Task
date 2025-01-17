// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const redisManager = require('../config/redis');

const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    return req.user.email;
  },
  handler: async (req, res) => {
    try {
      const client = await redisManager.getClient();
      const key = `ratelimit:${req.user.email}`;
      const count = await client.incr(key);
      
      if (count === 1) {
        await client.expire(key, 3600);
      }

      res.status(429).json({
        error: 'URL creation limit exceeded. You can create up to 50 URLs per hour.'
      });
    } catch (error) {
      console.error('Rate limit error:', error);
      res.status(429).json({ error: 'Too many requests' });
    }
  }
});

const burstLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.user.email;
  },
  handler: async (req, res) => {
    try {
      const client = await redisManager.getClient();
      const key = `burstlimit:${req.user.email}`;
      const count = await client.incr(key);
      
      if (count === 1) {
        await client.expire(key, 60);
      }

      res.status(429).json({
        error: 'Please wait a moment before creating more URLs. Maximum 5 URLs per minute.'
      });
    } catch (error) {
      console.error('Burst limit error:', error);
      res.status(429).json({ error: 'Too many requests' });
    }
  }
});

module.exports = {
  createUrlLimiter,
  burstLimiter
};