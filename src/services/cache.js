// src/services/cache.js
const redisManager = require('../config/redis');

const cacheService = {
  get: async (key) => {
    try {
      const client = await redisManager.getClient();
      const data = await client.get(key);
      console.log(data, 'data');
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  set: async (key, value, expires = 3600) => {
    try {
      const client = await redisManager.getClient();
      await client.set(key, JSON.stringify(value), {
        EX: expires
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  del: async (key) => {
    try {
      const client = await redisManager.getClient();
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }
};

module.exports = cacheService;