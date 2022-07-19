const errors = require('../constants/errors');

// const errorHandler = (err, req, res, next) => {
//   res.status(err.statusCode || 500).send({
//     message: `Ошибка: ${err.message || 'Ошибка на сервере'}`,
//   });

//   next();
// };

// const errorHandler = (err, req, res, next) => {
//   res.status(err.statusCode || 500).send(err.getResponse() || {
//     message: errors.serverError,
//   });

//   next();
// };

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || {
    message: errors.serverError,
  });

  next();
};

module.exports = errorHandler;
