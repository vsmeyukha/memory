class BasicError extends Error {
  getResponse() {
    return {
      message: this.message,
    };
  }
}

module.exports = BasicError;
