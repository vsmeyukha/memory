const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  affiliation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'memory',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
});

module.exports = mongoose.model('comment', commentSchema);
