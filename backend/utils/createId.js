const mongoose = require('mongoose');

const newInstanceId = () => mongoose.Types.ObjectId().toString();

module.exports = newInstanceId;
