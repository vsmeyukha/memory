const mongoose = require('mongoose');
const anyPostSchema = require('../constants/schemas/anyPostSchema');
const { localTimeWithoutSeconds } = require('../utils/time');

const obj = {
  ...anyPostSchema,
  affiliation: {
    ...anyPostSchema.affiliation,
  },
};

obj.affiliation.ref = 'deadPerson';

const memorySchema = new mongoose.Schema(
  {
    ...obj,
  },
  { timestamps: true },
);

// const memorySchema = new mongoose.Schema(
//   {
//     description: {
//       type: String,
//       // minlength: 10,
//       required: true,
//       default: '',
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'user',
//       required: true,
//     },
//     affiliation: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'deadPerson',
//       required: true,
//     },
//     photo: {
//       type: String,
//     },
//     createdAt: {
//       type: String,
//       // default: localTimeWithoutSeconds,
//       // required: true,
//     },
//     edited: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     updatedAt: {
//       type: String,
//       // default: localTimeWithoutSeconds,
//       // required: true,
//     },
//     timezone: { type: String },
//     reaction: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'user',
//     }],
//   },
//   {
//     timestamps: { currentTime: () => localTimeWithoutSeconds },
//   },
// );

// ? в этой модели устанавливаем время через встроенный функционал монгуса
// ? (по-другому в модели комментария)

// ! время редактирования обновляется невпопад обсудить

module.exports = mongoose.model('memory', memorySchema);
