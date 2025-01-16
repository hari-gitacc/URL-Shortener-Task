// src/routes/url.js

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create short URL
 *     security:
 *       - bearerAuth: []
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://www.example.com/very/long/url"
 *               customAlias:
 *                 type: string
 *                 example: "my-custom-url"
 *               topic:
 *                 type: string
 *                 enum: [acquisition, activation, retention]
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *       429:
 *         description: Rate limit exceeded
 *       401:
 *         description: Unauthorized
 * 
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     description: |
 *       **Note:** This endpoint requires browser interaction.
 *       To test:
 *       1. Copy the short URL (https://url-shortener-task-production.up.railway.app/api/shorten/your-alias)
 *       2. Open in a browser to be redirected to the original URL
 *       3. Analytics will be tracked automatically
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the shortened URL
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: URL not found
 */

const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url');
const auth = require('../middleware/auth');
const { createUrlLimiter, burstLimiter } = require('../middleware/rateLimit');

router.post('/', 
  auth, 
  createUrlLimiter,
  burstLimiter, // Optional: Add burst protection
  urlController.createShortUrl
);

router.get('/:alias', urlController.redirectToLongUrl);

module.exports = router;