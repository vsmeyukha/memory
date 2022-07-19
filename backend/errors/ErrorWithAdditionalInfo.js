class ErrorWithAdditionalInfo extends Error {
  constructor({ message, additionalInfo }) {
    super(message);

    this.additionalInfo = additionalInfo;
  }

  getResponse() {
    return {
      message: this.message,
      additionalInfo: this.additionalInfo,
    };
  }
}

module.exports = ErrorWithAdditionalInfo;
