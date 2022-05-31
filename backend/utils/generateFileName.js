const mongoose = require('mongoose');

const generateFileName = (file) => `${mongoose.Types.ObjectId().toString()}.${file.mimetype.slice(6)}`;

module.exports = generateFileName;
