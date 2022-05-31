const mongoose = require('mongoose');

const { localTimeWithoutSeconds } = require('../../utils/time');

const anyPostSchema = {
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
    ref: '',
    required: true,
  },
  photo: {
    type: String,
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
  timezone: {
    type: String,
  },
};

module.exports = anyPostSchema;
