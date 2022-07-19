const BasicError = require('./BasicError');

class ForbiddenError extends BasicError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
