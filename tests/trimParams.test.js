// tests/trimParams.test.js
const request = require('supertest');
const app = require('../src/app');

describe('trimParams Middleware', () => {
  it('should trim leading and trailing spaces in route parameters', async () => {
    const response = await request(app)
      .get('/test-trim/   myAliasWithSpaces   ')
      .expect(200);

    // The middleware should have trimmed the param
    expect(response.body.param).toBe('myAliasWithSpaces');
  });

  it('should not affect parameters without extra whitespace', async () => {
    const response = await request(app)
      .get('/test-trim/cleanParam')
      .expect(200);

    expect(response.body.param).toBe('cleanParam');
  });

  it('should trim tabs, newlines, and other whitespace characters', async () => {
    // '\t' represents a tab, '\n' represents a newline
    const response = await request(app)
      .get('/test-trim/\t\n  spacedParam \t\n')
      .expect(200);

    expect(response.body.param).toBe('spacedParam');
  });
});
