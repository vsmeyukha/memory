const mongoose = require('mongoose');

const newInstanceId = mongoose.Types.ObjectId().toString();
console.log(newInstanceId);

module.exports = newInstanceId;
