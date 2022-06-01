const localTimeWithoutSeconds = () => new Date().toLocaleString().slice(0, -3);

module.exports = { localTimeWithoutSeconds };
