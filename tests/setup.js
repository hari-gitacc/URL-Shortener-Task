// tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { closeRedis } = require('../src/services/cache');
const { closeRateLimitRedis } = require('../src/middleware/rateLimit');
require('dotenv').config();
// tests/setup.js


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await closeRedis();
  await closeRateLimitRedis();
});