const mongoose = require('mongoose');

const { localTimeWithoutSeconds } = require('../utils/time');

const memorySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      // minlength: 10,
      // required: true,
      default: '',
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
    photo: {
      type: String,
    },
    createdAt: {
      type: String,
      // default: localTimeWithoutSeconds,
      // required: true,
    },
    edited: {
      type: Boolean,
      required: true,
      default: false,
    },
    updatedAt: {
      type: String,
      // default: localTimeWithoutSeconds,
      // required: true,
    },
    timezone: { type: String },
    reaction: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
  },
  {
    timestamps: { currentTime: () => localTimeWithoutSeconds },
  },
);

// ? в этой модели устанавливаем время через встроенный функционал монгуса
// ? (по-другому в модели комментария)

// ! время редактирования обновляется невпопад обсудить

module.exports = mongoose.model('memory', memorySchema);
