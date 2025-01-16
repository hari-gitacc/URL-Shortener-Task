// src/routes/auth.js
/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth Login
 *     tags: [Auth]
 *     description: |
 *       **Note:** This endpoint requires browser interaction.
 *       To authenticate:
 *       1. Visit https://url-shortener-jjly.onrender.com/api/auth/google in your browser
 *       2. Complete Google sign-in
 *       3. Receive JWT token in callback response
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 * 
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     tags: [Auth]
 *     description: |
 *       **Internal Endpoint:** Handles Google OAuth callback.
 *       This endpoint is automatically called after Google sign-in.
 *       Returns HTML page with JWT token.
 *     responses:
 *       200:
 *         description: Returns HTML page containing JWT token
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 HTML page with JWT token
 *       401:
 *         description: Authentication failed
 */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication failed' });
          }
    
          const token = jwt.sign(
            { email: req.user.email },  // Using email from authenticated user
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
      
      // Send HTML response
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Success</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
              }
              .container {
                background-color: #f5f5f5;
                border-radius: 8px;
                padding: 20px;
              }
              .token-box {
                background-color: #e0e0e0;
                padding: 15px;
                border-radius: 4px;
                word-break: break-all;
                margin: 15px 0;
              }
              .user-info {
                margin: 15px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Authentication Successful!</h2>
              
              <div class="user-info">
                <h3>User Information:</h3>
                <p><strong>Name:</strong> ${req.user.name}</p>
                <p><strong>Email:</strong> ${req.user.email}</p>
                <p><strong>User ID:</strong> ${req.user._id}</p>
              </div>
  
              <h3>Your JWT Token:</h3>
              <div class="token-box">
                ${token}
              </div>
              
              <p><strong>Important:</strong> Please copy and save this token. You'll need it to make authenticated requests to the API.</p>
            </div>
          </body>
        </html>
      `);
    }
  );

module.exports = router;