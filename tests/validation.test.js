// tests/validation.test.js
const request = require('supertest');
const app = require('../src/app');
const { createTestUser } = require('./helpers/testSetup');

describe('URL Input Validation', () => {
    let token;

    beforeEach(async () => {
        const testData = await createTestUser();
        token = testData.token;
    });

    it('should reject invalid URLs', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl: 'not-a-url'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('Invalid URL format');
    });

    it('should reject invalid custom aliases', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl: 'https://example.com',
                customAlias: '@#$'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('Custom alias can only contain letters, numbers, hyphens, and underscores');
    });

    it('should reject invalid topics', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl: 'https://example.com',
                topic: 'invalid-topic'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('Invalid topic. Must be one of: acquisition, activation, retention');
    });
});