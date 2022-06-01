const mongoose = require('mongoose');

const localTimeWithoutSeconds = require('../../utils/time');

const anyPersonSchema = {
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
  sex: {
    type: Boolean,
  },
  dateOfBirth: {
    type: Date,
    min: '01-01-1900',
    max: Date(),
  },
  mainPhoto: {
    type: String,
  },
  createdAt: {
    type: String,
    default: localTimeWithoutSeconds,
    required: true,
  },
};

module.exports = anyPersonSchema;
