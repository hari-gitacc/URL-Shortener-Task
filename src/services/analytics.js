// src/services/analytics.js
const Analytics = require('../models/analytics');
const Url = require('../models/url');
const cacheService = require('./cache');

const analyticsService = {
  // Track a new visit
  trackVisit: async (urlId, visitData) => {
    try {
      const analytics = new Analytics({
        urlId,
        ...visitData
      });
      await analytics.save();
      
      // Invalidate cached analytics for this URL
      const url = await Url.findById(urlId);
      if (url) {
        await cacheService.del(`analytics:${url.shortUrl}`);
      }
    } catch (error) {
      console.error('Error tracking visit:', error);
      throw error;
    }
  },

  // Get analytics for a specific URL
  getUrlAnalytics: async (urlId) => {
    try {
      const url = await Url.findById(urlId);
      if (!url) return null;

      const cacheKey = `analytics:${url.shortUrl}`;
      let analytics = await cacheService.get(cacheKey);

      if (!analytics) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [
          totalClicks,
          uniqueIPs,
          clicksByDate,
          osStats,
          deviceStats
        ] = await Promise.all([
          Analytics.countDocuments({ urlId }),
          Analytics.distinct('ipAddress', { urlId }),
          Analytics.aggregate([
            {
              $match: {
                urlId,
                timestamp: { $gte: sevenDaysAgo }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]),
          Analytics.aggregate([
            {
              $match: { urlId }
            },
            {
              $group: {
                _id: "$os",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" }
              }
            },
            {
              $project: {
                osName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" }
              }
            }
          ]),
          Analytics.aggregate([
            {
              $match: { urlId }
            },
            {
              $group: {
                _id: "$device",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" }
              }
            },
            {
              $project: {
                deviceName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" }
              }
            }
          ])
        ]);

        analytics = {
          totalClicks,
          uniqueUsers: uniqueIPs.length,
          clicksByDate: clicksByDate.map(item => ({
            date: item._id,
            clicks: item.count
          })),
          osType: osStats.map(item => ({
            osName: item.osName,
            uniqueClicks: item.uniqueClicks,
            uniqueUsers: item.uniqueUsers
          })),
          deviceType: deviceStats.map(item => ({
            deviceName: item.deviceName,
            uniqueClicks: item.uniqueClicks,
            uniqueUsers: item.uniqueUsers
          }))
        };

        // Cache for 5 minutes
        await cacheService.set(cacheKey, analytics, 300);
      }

      return analytics;
    } catch (error) {
      console.error('Error getting URL analytics:', error);
      throw error;
    }
  },

  // Get analytics for URLs under a specific topic
  getTopicAnalytics: async (topic, userEmail) => {
    try {
      const urls = await Url.find({ userEmail, topic });
      const urlIds = urls.map(url => url._id);

      const [totalClicks, uniqueIPs, clicksByDate, urlStats] = await Promise.all([
        Analytics.countDocuments({ urlId: { $in: urlIds } }),
        Analytics.distinct('ipAddress', { urlId: { $in: urlIds } }),
        Analytics.aggregate([
          {
            $match: { urlId: { $in: urlIds } }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        Promise.all(urls.map(async url => {
          const [clicks, uniques] = await Promise.all([
            Analytics.countDocuments({ urlId: url._id }),
            Analytics.distinct('ipAddress', { urlId: url._id })
          ]);
          return {
            shortUrl: url.shortUrl,
            totalClicks: clicks,
            uniqueUsers: uniques.length
          };
        }))
      ]);

      return {
        totalClicks,
        uniqueUsers: uniqueIPs.length,
        clicksByDate: clicksByDate.map(item => ({
          date: item._id,
          clicks: item.count
        })),
        urls: urlStats
      };
    } catch (error) {
      console.error('Error getting topic analytics:', error);
      throw error;
    }
  },

  // Get overall analytics for all URLs of a user
  getOverallAnalytics: async (userEmail) => {
    try {
      const urls = await Url.find({ userEmail });
      const urlIds = urls.map(url => url._id);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalClicks,
        uniqueIPs,
        clicksByDate,
        osStats,
        deviceStats
      ] = await Promise.all([
        Analytics.countDocuments({ urlId: { $in: urlIds } }),
        Analytics.distinct('ipAddress', { urlId: { $in: urlIds } }),
        Analytics.aggregate([
          {
            $match: {
              urlId: { $in: urlIds },
              timestamp: { $gte: sevenDaysAgo }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        Analytics.aggregate([
          {
            $match: { urlId: { $in: urlIds } }
          },
          {
            $group: {
              _id: "$os",
              uniqueClicks: { $sum: 1 },
              uniqueUsers: { $addToSet: "$ipAddress" }
            }
          },
          {
            $project: {
              osName: "$_id",
              uniqueClicks: 1,
              uniqueUsers: { $size: "$uniqueUsers" }
            }
          }
        ]),
        Analytics.aggregate([
          {
            $match: { urlId: { $in: urlIds } }
          },
          {
            $group: {
              _id: "$device",
              uniqueClicks: { $sum: 1 },
              uniqueUsers: { $addToSet: "$ipAddress" }
            }
          },
          {
            $project: {
              deviceName: "$_id",
              uniqueClicks: 1,
              uniqueUsers: { $size: "$uniqueUsers" }
            }
          }
        ])
      ]);

      return {
        totalUrls: urls.length,
        totalClicks,
        uniqueUsers: uniqueIPs.length,
        clicksByDate: clicksByDate.map(item => ({
          date: item._id,
          clicks: item.count
        })),
        osType: osStats.map(item => ({
          osName: item.osName,
          uniqueClicks: item.uniqueClicks,
          uniqueUsers: item.uniqueUsers
        })),
        deviceType: deviceStats.map(item => ({
          deviceName: item.deviceName,
          uniqueClicks: item.uniqueClicks,
          uniqueUsers: item.uniqueUsers
        }))
      };
    } catch (error) {
      console.error('Error getting overall analytics:', error);
      throw error;
    }
  }
};

module.exports = analyticsService;