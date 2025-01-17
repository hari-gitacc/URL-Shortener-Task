// src/config/redis.js
const { createClient } = require('redis');

class RedisManager {
  constructor() {
    this.client = null;
  }

  async getClient() {
    if (!this.client) {
      const config = {
        url: `redis://${process.env.REDIS_HOST}`
      };

      if (process.env.NODE_ENV !== 'production') {
        config.password = process.env.REDIS_PASSWORD;
      }

      this.client = createClient(config);

      this.client.on('connect', () => {
        console.log(`Redis Connected (${process.env.NODE_ENV} mode)`);
      });

      this.client.on('error', (err) => {
        console.error('Redis Error:', err);
      });

      await this.client.connect();
    }
    return this.client;
  }

  async quit() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

module.exports = new RedisManager();