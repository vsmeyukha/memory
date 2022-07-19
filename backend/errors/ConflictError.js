const ErrorWithAdditionalInfo = require('./ErrorWithAdditionalInfo');

class ConflictError extends ErrorWithAdditionalInfo {
  constructor(obj) {
    super(obj);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
