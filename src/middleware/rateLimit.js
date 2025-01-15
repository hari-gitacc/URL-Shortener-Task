// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');

let redisClient = null;

const initializeRateLimitRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}`,
      password: process.env.REDIS_PASSWORD,
    });
    await redisClient.connect();
  }
  return redisClient;
};

const closeRateLimitRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

// Initialize for non-test environments
if (process.env.NODE_ENV !== 'test') {
  initializeRateLimitRedis();
}

const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    return req.user.email;
  },
  message: {
    error: 'URL creation limit exceeded. You can create up to 50 URLs per hour.'
  }
});

const burstLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.user.email;
  },
  message: {
    error: 'Please wait a moment before creating more URLs. Maximum 5 URLs per minute.'
  }
});

module.exports = {
  createUrlLimiter,
  burstLimiter,
  initializeRateLimitRedis,
  closeRateLimitRedis
};