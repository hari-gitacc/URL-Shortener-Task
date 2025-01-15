// src/models/analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
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
    country: String,
    city: String,
    region: String,
    timezone: String,
    ll: [Number] // [latitude, longitude]
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);