const mongoose = require('mongoose');
const validation = require('validator');
const errors = require('../constants/errors');

const memory = require('./memory');

const deadPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  surname: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  patronymic: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  dateOfBirth: {
    type: Date,
    min: '01-01-1900',
    max: Date(),
  },
  dateOfDeath: {
    type: Date,
    max: Date(),
  },
  placeOfBirth: {
    type: String,
  },
  placeOfDeath: {
    type: String,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 2000,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  mainPhoto: {
    type: String,
  },
  // memory: [memory],
});

module.exports = mongoose.model('deadPerson', deadPersonSchema);
