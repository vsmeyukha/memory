const mongoose = require('mongoose');

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
    type: Date,
    default: Date.now,
  },
  reaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
});

module.exports = mongoose.model('memory', memorySchema);
