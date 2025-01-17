const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Url = require('../src/models/url');  // Add this too
const jwt = require('jsonwebtoken');

// tests/analytics.test.js
describe('Analytics API', () => {
    let token;
    let testUser;
    let testUrl;
    const testEmail = `test${Date.now()}@example.com`;
  
    beforeEach(async () => {
      await User.deleteMany({});
      await Url.deleteMany({}); // Add this to clear URLs
  
      testUser = await User.create({
        googleId: `test${Date.now()}`,
        email: testEmail,
        name: 'Test User'
      });
      token = jwt.sign({ email: testEmail }, process.env.JWT_SECRET);
  
      // Create single URL with topic
      const createResponse = await request(app)
        .post('/api/shorten')
        .set('Authorization', `Bearer ${token}`)
        .send({
          longUrl: 'https://example.com',
          customAlias: `test${Date.now()}`,
          topic: 'acquisition' // Make sure to set topic
        });
      testUrl = createResponse.body;
  
      // Generate visits
      await request(app).get(`/api/shorten/${testUrl.shortUrl}`);
      await request(app).get(`/api/shorten/${testUrl.shortUrl}`);
    });
  
    describe('GET /api/analytics/:alias', () => {
      it('should return URL analytics', async () => {
        const response = await request(app)
          .get(`/api/analytics/${testUrl.shortUrl}`)
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(200);
        expect(response.body.totalClicks).toBe(2);
      });
    });
  
    describe('GET /api/analytics/topic/:topic', () => {
      it('should return topic analytics', async () => {
        const response = await request(app)
          .get('/api/analytics/topic/acquisition')
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(200);
        expect(response.body.urls.length).toBeGreaterThan(0); // Should work now
      });
    });
  
    describe('GET /api/analytics/overall', () => {
      it('should return overall analytics', async () => {
        const response = await request(app)
          .get('/api/analytics/overall')
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(200);
        expect(response.body.totalUrls).toBe(1); // Now correctly expecting 1
        expect(response.body.totalClicks).toBe(2);
      });
    });
  });