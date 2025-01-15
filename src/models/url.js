const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userEmail: {   
    type: String,
    ref: 'User',
    required: true
  },
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  },
  customAlias: String,
  topic: {
    type: String,
    enum: ['acquisition', 'activation', 'retention'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', urlSchema);