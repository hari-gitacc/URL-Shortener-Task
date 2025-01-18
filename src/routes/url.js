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
 *                 pattern: "^[a-zA-Z0-9-_]+$"
 *                 minLength: 3
 *                 maxLength: 20
 *               topic:
 *                 type: string
 *                 enum: [acquisition, activation, retention]
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "my-custom-url"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-14T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [
 *                     "Long URL is required",
 *                     "Invalid URL format",
 *                     "Custom alias must be at least 3 characters long",
 *                     "Custom alias cannot exceed 20 characters",
 *                     "Custom alias can only contain letters, numbers, hyphens, and underscores",
 *                     "Invalid topic. Must be one of: acquisition, activation, retention"
 *                   ]
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ["URL creation limit exceeded. You can create up to 50 URLs per hour.",
 *                             " Please wait a moment before creating more URLs. Maximum 5 URLs per minute."] 
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
 * 
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     description: |
 *       **Note:** This endpoint requires browser interaction.
 *       To test:
 *       1. Copy the short URL (https://url-shortener-jjly.onrender.com/api/shorten/your-alias)
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
const urlController = require('../controllers/url');
const auth = require('../middleware/auth');
const { createUrlLimiter, burstLimiter } = require('../middleware/rateLimit');
const { validateUrlInput } = require('../middleware/validation');

router.post('/', 
    auth, 
    validateUrlInput,
    createUrlLimiter,
    burstLimiter,
    urlController.createShortUrl
);
router.get('/:alias', urlController.redirectToLongUrl);

module.exports = router;