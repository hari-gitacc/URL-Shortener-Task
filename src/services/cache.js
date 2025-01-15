// src/services/cache.js
const { createClient } = require('redis');

let client = null;

const initializeRedis = async () => {
  if (!client) {
    client = createClient({
      url: `redis://${process.env.REDIS_HOST}`,
      password: process.env.REDIS_PASSWORD,
    });

    client.on('connect', () => console.log('Redis Cloud Connected'));
    client.on('error', err => console.log('Redis Error:', err));

    await client.connect();
  }
  return client;
};

const closeRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
  }
};

const cacheService = {
  get: async (key) => {
    const redisClient = await initializeRedis();
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  set: async (key, value, expires = 3600) => {
    const redisClient = await initializeRedis();
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: expires
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  del: async (key) => {
    const redisClient = await initializeRedis();
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }
};

module.exports = {
  ...cacheService,
  initializeRedis,
  closeRedis
};