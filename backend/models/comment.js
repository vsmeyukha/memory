const mongoose = require('mongoose');
const anyPostSchema = require('../constants/schemas/anyPostSchema');

const obj = {
  ...anyPostSchema,
  affiliation: {
    ...anyPostSchema.affiliation,
  },
};

obj.affiliation.ref = 'memory';

const commentSchema = new mongoose.Schema(
  {
    ...obj,
  },
);

module.exports = mongoose.model('comment', commentSchema);
