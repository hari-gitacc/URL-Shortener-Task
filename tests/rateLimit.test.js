// tests/rateLimit.test.js
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');

describe('Rate Limiting', () => {
  let token;
  let testUser;

  const testEmail = `test${Date.now()}@example.com`;

  beforeEach(async () => {
    await User.deleteMany({});
    
    testUser = await User.create({
      googleId: `test${Date.now()}`,
      email: testEmail,
      name: 'Test User'
    });
    token = jwt.sign({ email: testEmail }, process.env.JWT_SECRET);
  });
  it('should limit URL creation rate', async () => {
    const requests = [];
    // Try to create 6 URLs quickly (assuming limit is 5 per minute)
    for (let i = 0; i < 6; i++) {
      requests.push(
        request(app)
          .post('/api/shorten')
          .set('Authorization', `Bearer ${token}`)
          .send({
            longUrl: `https://example.com/${i}`
          })
      );
    }

    const responses = await Promise.all(requests);
    const lastResponse = responses[responses.length - 1];

    expect(lastResponse.status).toBe(429); // Too Many Requests
  });
});