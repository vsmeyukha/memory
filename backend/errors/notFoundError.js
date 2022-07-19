const BasicError = require('./BasicError');

class NotFoundError extends BasicError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
