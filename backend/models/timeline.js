const mongoose = require('mongoose');

const anyPostSchema = require('../constants/schemas/anyPostSchema');

const obj = {
  ...anyPostSchema,
  affiliation: {
    ...anyPostSchema.affiliation,
  },
};

obj.affiliation.ref = 'deadPerson';

const timelineSchema = new mongoose.Schema({
  ...obj,
  dateOfEvent: {
    type: Date,
    min: '01-01-1900',
    max: Date(),
    required: true,
  },
});

module.exports = mongoose.model('timeline', timelineSchema);
