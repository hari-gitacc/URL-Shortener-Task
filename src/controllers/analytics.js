// src/controllers/analytics.js
const analyticsService = require('../services/analytics');
const Url = require('../models/url');
const Analytics = require('../models/analytics');
const deviceDetector = require('../utils/deviceDetector');
const geoip = require('geoip-lite');

const analyticsController = {
  // Individual URL Analytics
  getUrlAnalytics: async (req, res) => {
    try {
      const { alias } = req.params;
      const userEmail = req.user.email;  // Get the requesting user's email

      // Find URL and check ownership
      const url = await Url.findOne({ 
        shortUrl: alias,
        userEmail: userEmail  
      });
      
      if (!url) {
        return res.status(404).json({ 
          error: 'URL not found ' 
        });
      }

      const analytics = await analyticsService.getUrlAnalytics(url._id);
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Error fetching analytics' });
    }
  },

  // Topic-based Analytics
  getTopicAnalytics: async (req, res) => {
    try {
      const { topic } = req.params;
      const userEmail = req.user.email;

      const topicStats = await analyticsService.getTopicAnalytics(topic, userEmail);
      res.json(topicStats);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching topic analytics' });
    }
  },

  // Overall Analytics
  getOverallAnalytics: async (req, res) => {
    try {

        console.log(req.user, 'req.user');
        
      const userEmail = req.user.email;
      
      const overallStats = await analyticsService.getOverallAnalytics(userEmail);
      console.log(overallStats);
      
      res.json(overallStats);
    } catch (error) {
            console.log(error);
            
      res.status(500).json({ error: 'Error fetching overall analytics' });
    }
  },



// Track URL Visit
trackVisit: async (req, urlId) => {
  try {
    // Extract the IP address from x-forwarded-for (if available) or fallback to other sources.
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor
      ? forwardedFor.split(',')[0].trim()  // Use only the first IP
      : req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        '0.0.0.0';

    // Clean the IP address (remove IPv6 prefix if present)
    const cleanIP = ip.replace(/^.*:/, '');

    const userAgent = req.headers['user-agent'];
    const deviceInfo = deviceDetector.parseUserAgent(userAgent);

    // Use a test IP for development if configured
    const testIP = '8.8.8.8'; // Google's DNS for testing
    const useTestIp = process.env.NODE_ENV === 'development';
    const ipForGeo = useTestIp ? testIP : cleanIP;

    // Lookup geo location data using the cleaned IP
    const geoData = geoip.lookup(ipForGeo);

    const visitData = {
      urlId,
      ipAddress: cleanIP,
      userAgent,
      device: deviceInfo.device,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      location: geoData ? {
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        timezone: geoData.timezone,
        ll: geoData.ll
      } : null,
      timestamp: new Date()
    };

    await Analytics.create(visitData);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}


};

module.exports = analyticsController;
