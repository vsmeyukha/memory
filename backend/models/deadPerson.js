const mongoose = require('mongoose');
const validation = require('validator');
const errors = require('../constants/errors');

const anyPersonSchema = require('../constants/schemas/anyPersonSchema');

const obj = {
  ...anyPersonSchema,
  dateOfBirth: {
    ...anyPersonSchema.dateOfBirth,
    required: true,
  },
};

const deadPersonSchema = new mongoose.Schema(
  {
    ...obj,
    dateOfDeath: {
      type: Date,
      max: Date(),
      required: true,
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
    mainGallery: [{
      type: String,
    }], // ? как ограничить длину массива?
    hobbyGallery: [{
      type: String,
    }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('deadPerson', deadPersonSchema);
