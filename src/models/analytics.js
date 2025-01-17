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
});

module.exports = mongoose.model('Analytics', analyticsSchema);