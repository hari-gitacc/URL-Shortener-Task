// src/utils/deviceDetector.js
const UAParser = require('ua-parser-js');

const deviceDetector = {
  parseUserAgent: (userAgent) => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    return {
      device: result.device.type || 'desktop',
      os: result.os.name || 'unknown',
      browser: result.browser.name || 'unknown'
    };
  }
};

module.exports = deviceDetector;