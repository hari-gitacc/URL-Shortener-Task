// src/middleware/validation.js
const { URL } = require('url');

const validateUrlInput = (req, res, next) => {
    const { longUrl, customAlias, topic } = req.body;
    const errors = [];

    // Validate longUrl (required)
    try {
        if (!longUrl) {
            errors.push('Long URL is required');
        } else {
            new URL(longUrl); // Will throw if invalid URL
        }
    } catch (error) {
        errors.push('Invalid URL format');
    }

    // Validate customAlias only if provided
    if (customAlias) {
        if (customAlias.length < 3) {
            errors.push('Custom alias must be at least 3 characters long');
        }
        if (customAlias.length > 20) {
            errors.push('Custom alias cannot exceed 20 characters');
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
            errors.push('Custom alias can only contain letters, numbers, hyphens, and underscores');
        }
    }

    // Validate topic if provided
    if (topic) {
        const allowedTopics = ['acquisition', 'activation', 'retention'];
        if (!allowedTopics.includes(topic)) {
            errors.push('Invalid topic. Must be one of: acquisition, activation, retention');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = { validateUrlInput };