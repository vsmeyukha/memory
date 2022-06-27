const newInstanceId = require('./createId');

const generateFileName = (file) => `${newInstanceId().toString()}.${file.mimetype.slice(6)}`;

module.exports = generateFileName;
