/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for specific URL
 *     security:
 *       - bearerAuth: []
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-custom-url"
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   example: 150
 *                 uniqueUsers:
 *                   type: number
 *                   example: 75
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-15"
 *                       clicks:
 *                         type: number
 *                         example: 30
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: number
 *                         example: 50
 *                       uniqueUsers:
 *                         type: number
 *                         example: 25
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL not found"
 *
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     security:
 *       - bearerAuth: []
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *           enum: [acquisition, activation, retention]
 *         example: "acquisition"
 *     responses:
 *       200:
 *         description: Topic analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   example: 300
 *                 uniqueUsers:
 *                   type: number
 *                   example: 150
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-15"
 *                       clicks:
 *                         type: number
 *                         example: 45
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         example: "my-acquisition-url"
 *                       totalClicks:
 *                         type: number
 *                         example: 120
 *                       uniqueUsers:
 *                         type: number
 *                         example: 60
 *
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for all URLs
 *     security:
 *       - bearerAuth: []
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overall analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: number
 *                   example: 10
 *                 totalClicks:
 *                   type: number
 *                   example: 500
 *                 uniqueUsers:
 *                   type: number
 *                   example: 250
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-01-15"
 *                       clicks:
 *                         type: number
 *                         example: 100
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: number
 *                         example: 200
 *                       uniqueUsers:
 *                         type: number
 *                         example: 100
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         example: "desktop"
 *                       uniqueClicks:
 *                         type: number
 *                         example: 300
 *                       uniqueUsers:
 *                         type: number
 *                         example: 150
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
  * /api/analytics/{alias}/locations:
 *   get:
 *     summary: Get list of locations that accessed this URL (Additional Feature)
 *     description: |
 *       This is an additional endpoint beyond the core requirements.
 *       Provides geographic distribution data for URL visits based on the collected location data.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-custom-url"
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "my-custom-url"
 *                 totalLocations:
 *                   type: number
 *                   example: 3
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                         example: "United States"
 *                       region:
 *                         type: string
 *                         example: "California"
 *                       city:
 *                         type: string
 *                         example: "San Francisco"
 *                       visits:
 *                         type: number
 *                         example: 45
 *                       uniqueVisitors:
 *                         type: number
 *                         example: 30
 *                       lastVisit:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-17T16:37:09.817Z"
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "URL not found"
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');
const auth = require('../middleware/auth');

router.get('/overall', auth, analyticsController.getOverallAnalytics);
router.get('/:alias', auth, analyticsController.getUrlAnalytics);
router.get('/topic/:topic', auth, analyticsController.getTopicAnalytics);

// Additional endpoint
router.get('/:alias/locations', auth, analyticsController.getLocationAnalytics);

module.exports = router;