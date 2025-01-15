// src/middleware/testIp.js
const testIpMiddleware = (req, res, next) => {
    // Array of test IPs from different locations
    const testIPs = [
      '157.240.1.35',   // India (Facebook's IP)
      '172.217.167.78', // US (Google's IP)
      '178.62.125.25',  // UK
      '131.72.69.42'    // Brazil
    ];
    
    // Randomly select a test IP
    const randomIP = testIPs[Math.floor(Math.random() * testIPs.length)];
    req.ip = randomIP;
    req.headers['x-forwarded-for'] = randomIP;
    
    next();
  };
  
  module.exports = testIpMiddleware;