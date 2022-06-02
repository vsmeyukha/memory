const newInstanceId = require('../utils/createId');

const createInstanceId = (req, res, next) => {
  req.instanceId = newInstanceId;

  next();
};

module.exports = createInstanceId;
