// tests/url.test.js
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');

// tests/url.test.js
describe('URL Shortener API', () => {
    let token;
    let testUser;
    const testEmail = `test${Date.now()}@example.com`;
  
    // Move beforeEach outside of the test
    beforeEach(async () => {
      await User.deleteMany({});
      testUser = await User.create({
        googleId: `test${Date.now()}`,
        email: testEmail,
        name: 'Test User'
      });
      token = jwt.sign({ email: testEmail }, process.env.JWT_SECRET);
    });
  
    describe('POST /api/shorten', () => {
      it('should create a short URL', async () => {
        const response = await request(app)
          .post('/api/shorten')
          .set('Authorization', `Bearer ${token}`)
          .send({
            longUrl: 'https://example.com',
            customAlias: `test${Date.now()}`
          });
  
        expect(response.status).toBe(201);
      });
    });
  });