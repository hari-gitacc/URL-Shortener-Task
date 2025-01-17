// tests/helpers/testSetup.js
const User = require('../../src/models/user');
const jwt = require('jsonwebtoken');

const createTestUser = async () => {
    // Clear existing users from test database
    await User.deleteMany({});
    
    const testEmail = `test${Date.now()}@example.com`;
    
    // Create test user
    const user = await User.create({
        googleId: `test${Date.now()}`,
        email: testEmail,
        name: 'Test User'
    });

    // Generate token
    const token = jwt.sign({ email: testEmail }, process.env.JWT_SECRET);

    return { user, token };
};

module.exports = { createTestUser };