const memoryId = require('../utils/createId');

const createMemoryId = (req, res, next) => {
  req.memoryId = memoryId;

  next();
};

module.exports = createMemoryId;
