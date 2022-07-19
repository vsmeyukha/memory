const BasicError = require('./BasicError');

class CastError extends BasicError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = CastError;
