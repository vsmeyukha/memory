const mongoose = require('mongoose');
const anyPostSchema = require('../constants/schemas/anyPostSchema');

const obj = {
  ...anyPostSchema,
  affiliation: {
    ...anyPostSchema.affiliation,
  },
};

obj.affiliation.ref = 'memory';

const commentToMemorySchema = new mongoose.Schema(
  {
    ...obj,
  },
  { timestamps: true },
);

module.exports = mongoose.model('commenttomemory', commentToMemorySchema);
