// ! модуль для создания токена
const jwt = require('jsonwebtoken');

// ! ошибочка авторизации
const AuthorizationError = require('../errors/authorizationError');

// ! тексты ошибочек
const errors = require('../constants/errors');

const auth = (req, res, next) => {
  const { JWT_SECRET = 'very-secret-key' } = process.env;

  // ? записываем куку с токеном в переменную
  const token = req.cookies.jwt;

  // ? если нету ее, то выбрасывааем ошибку авторизации
  if (!token) {
    return next(new AuthorizationError(errors.authorization));
  }

  // ? а если есть, создаем переменную
  let payload;

  try {
    // ? в эту переменную записываем токен, который был верифицирован
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // ? если токен не верифицирован, выбрасываем ошибку неверного токена
    return next(new AuthorizationError(errors.authorizationToken));
  }

  // ? записываем верифицированный токен в req.user
  req.user = payload;

  // ? и передаем дальше
  return next();
};

module.exports = auth;
