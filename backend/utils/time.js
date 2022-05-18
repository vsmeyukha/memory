const date = new Date();
const localTimeWithoutSeconds = date.toLocaleString().slice(0, -3);

module.exports = { localTimeWithoutSeconds };
