// src/services/url.js
const crypto = require('crypto');
const Url = require('../models/url');

const generateShortUrl = () => {
  return crypto.randomBytes(4).toString('hex');
};

const urlService = {
  createShortUrl: async (userEmail, longUrl, customAlias, topic) => {
    try {
      // Check if custom alias is already taken
      if (customAlias) {
        const existingUrl = await Url.findOne({ shortUrl: customAlias });
        if (existingUrl) {
          throw new Error('Custom alias already in use');
        }
      }

      const shortUrl = customAlias || generateShortUrl();
      
      const url = new Url({
        userEmail,
        longUrl,
        shortUrl,
        topic,
        createdAt: new Date()
      });

      await url.save();
      return url;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = urlService;