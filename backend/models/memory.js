const mongoose = require('mongoose');

const { localTimeWithoutSeconds } = require('../utils/time');

const memorySchema = new mongoose.Schema({
  description: {
    type: String,
    minlength: 10,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  affiliation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deadPerson',
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
});

module.exports = mongoose.model('memory', memorySchema);
