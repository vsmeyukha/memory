const BasicError = require('./BasicError');

class AuthorizationError extends BasicError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
