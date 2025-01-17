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
 *                         example: 40
 *                       uniqueUsers:
 *                         type: number
 *                         example: 20
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
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                       totalClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
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
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');
const auth = require('../middleware/auth');

router.get('/overall', auth, analyticsController.getOverallAnalytics);
router.get('/:alias', auth, analyticsController.getUrlAnalytics);
router.get('/topic/:topic', auth, analyticsController.getTopicAnalytics);

module.exports = router;