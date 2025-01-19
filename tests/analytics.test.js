const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Url = require('../src/models/url');
const Analytics = require('../src/models/analytics');
const jwt = require('jsonwebtoken');

describe('Analytics API', () => {
  let token;
  let testUser;
  let testUrl;
  let otherUserToken;
  let otherUserUrl;
  const testEmail = `test${Date.now()}@example.com`;

  beforeEach(async () => {
    // Clear databases
    await User.deleteMany({});
    await Url.deleteMany({});
    await Analytics.deleteMany({});

    // Create test user
    testUser = await User.create({
      googleId: `test${Date.now()}`,
      email: testEmail,
      name: 'Test User'
    });
    token = jwt.sign({ email: testEmail }, process.env.JWT_SECRET);

    // Create URL for test user
    const createResponse = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        longUrl: 'https://example.com',
        customAlias: `test${Date.now()}`,
        topic: 'acquisition'
      });
    testUrl = createResponse.body;

    // Create other user and URL
    const otherUser = await User.create({
      googleId: `other${Date.now()}`,
      email: `other${Date.now()}@example.com`,
      name: 'Other User'
    });
    otherUserToken = jwt.sign({ email: otherUser.email }, process.env.JWT_SECRET);

    const otherResponse = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({
        longUrl: 'https://example.com',
        customAlias: `other${Date.now()}`
      });
    otherUserUrl = otherResponse.body;

    // Generate visits
    await request(app).get(`/api/shorten/${testUrl.shortUrl}`);
    await request(app).get(`/api/shorten/${testUrl.shortUrl}`);
  });

  // Existing test cases
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
      expect(response.body.urls.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/analytics/overall', () => {
    it('should return overall analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/overall')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.totalUrls).toBe(1);
      expect(response.body.totalClicks).toBe(2);
    });
  });

  // New location analytics tests
  describe('GET /api/analytics/:alias/locations', () => {
    it('should return location analytics for user\'s own URL', async () => {
      const response = await request(app)
        .get(`/api/analytics/${testUrl.shortUrl}/locations`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('shortUrl', testUrl.shortUrl);
      expect(response.body).toHaveProperty('totalLocations');
      expect(response.body).toHaveProperty('locations');

      if (response.body.locations.length > 0) {
        const location = response.body.locations[0];
        expect(location).toHaveProperty('country');
        expect(location).toHaveProperty('region');
        expect(location).toHaveProperty('city');
        expect(location).toHaveProperty('visits');
        expect(location).toHaveProperty('uniqueVisitors');
        expect(location).toHaveProperty('lastVisit');
      }
    });

    it('should return 404 when accessing another user\'s URL', async () => {
      const response = await request(app)
        .get(`/api/analytics/${otherUserUrl.shortUrl}/locations`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });

    it('should return 404 for non-existent URL', async () => {
      const response = await request(app)
        .get('/api/analytics/non-existent-url/locations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'URL not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/analytics/${testUrl.shortUrl}/locations`);

      expect(response.status).toBe(401);
    });
  });
});