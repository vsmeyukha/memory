const mongoose = require('mongoose');
const anyPostSchema = require('../constants/schemas/anyPostSchema');

const obj = {
  ...anyPostSchema,
  affiliation: {
    ...anyPostSchema.affiliation,
  },
};

obj.affiliation.ref = 'timeline';

const commentToTimelineSchema = new mongoose.Schema(
  {
    ...obj,
  },
  { timestamps: true },
);

module.exports = mongoose.model('commenttotimeline', commentToTimelineSchema);
