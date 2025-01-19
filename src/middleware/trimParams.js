// src/middlewares/trimParams.js

function trimParams(req, res, next) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].trim();
      }
    }
    next();
  }
  
module.exports = trimParams;
  