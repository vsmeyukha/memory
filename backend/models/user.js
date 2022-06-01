const mongoose = require('mongoose');
const validation = require('validator');
const errors = require('../constants/errors');

const anyPersonSchema = require('../constants/schemas/anyPersonSchema');

const userSchema = new mongoose.Schema({
  ...anyPersonSchema,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validation.isEmail(v);
      },
      message: errors.invalidEmail,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
