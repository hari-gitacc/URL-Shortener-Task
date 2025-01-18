const Url = require('../models/url'); // Add this import
const urlService = require('../services/url');
const cacheService = require('../services/cache');
const analyticsController = require('./analytics');

const urlController = {
createShortUrl: async (req, res) => {
    try {
        const { longUrl, customAlias, topic } = req.body;
        console.log(longUrl, customAlias, topic);
        
        const userEmail = req.user.email;

        // URL creation logic
        const url = await urlService.createShortUrl(
            userEmail,
            longUrl,
            customAlias,
            topic
        );

        // Cache the new URL
        await cacheService.set(`url:${url.shortUrl}`, url);

        res.status(201).json({
            shortUrl: url.shortUrl,
            createdAt: url.createdAt
        });
    } catch (error) {
        if (error.message === 'Custom alias already in use') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Error creating short URL' });
    }
},

    // In your redirectToLongUrl function:
    redirectToLongUrl: async (req, res) => {
        try {
            const { alias } = req.params;

            // Try to get URL from cache
            let url = await cacheService.get(`url:${alias}`);

            if (!url) {
                console.log('url not found in cache');
                
                url = await Url.findOne({ shortUrl: alias });
                if (!url) {
                    return res.status(404).json({ error: 'URL not found' });
                }
                await cacheService.set(`url:${alias}`, url);
            }

            // Track the visit
            await analyticsController.trackVisit(req, url._id);

            res.redirect(url.longUrl);
        } catch (error) {
            console.error('Redirect error:', error);
            res.status(500).json({ error: 'Error redirecting to URL' });
        }
    }
};

module.exports = urlController;