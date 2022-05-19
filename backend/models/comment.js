const mongoose = require('mongoose');

const { localTimeWithoutSeconds } = require('../utils/time');

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
    type: String,
    default: localTimeWithoutSeconds,
    required: true,
  },
  reaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  edited: {
    type: Boolean,
    required: true,
    default: false,
  },
  editedAt: {
    type: String,
    default: '',
  },
  timezone: { type: String },
});

// ? в этой модели устанавливаем время самостоятельным путем

module.exports = mongoose.model('comment', commentSchema);
