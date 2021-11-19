// шифрование пароля и генерация токена
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// тексты
const errors = require('../constants/errors');
const messages = require('../constants/messages');

// ошибочки
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/authorizationError');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/castError');

// модель
const User = require('../models/user');

const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({});
  return res.status(200).send(allUsers);
};

const register = async (req, res, next) => {
  try {
    // деструктурируем тело ответа, присваиваем поля ответа переменным
    const {
      name,
      surname,
      patronymic,
      email,
      password,
    } = req.body;

    // шифруем пароль
    const encryptedPassword = await bcrypt.hash(password, 10);

    // создаем нового юзера,
    // только вместо введенного пользователем пароля сохраняем в базу зашифрованный
    const userWithEncryptedPassword = await User.create({
      name,
      surname,
      patronymic,
      email,
      password: encryptedPassword,
    });

    return res.status(200).send({
      name: userWithEncryptedPassword.name,
      surname: userWithEncryptedPassword.surname,
      patronymic: userWithEncryptedPassword.patronymic,
      email: userWithEncryptedPassword.email,
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return next(new ConflictError(errors.invalidEmail));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { NODE_ENV, JWT_SECRET = 'very-secret-key' } = process.env;

    const { email, password } = req.body;

    const userFoundByEmail = await User.findOne({ email }).select('+password');

    if (!userFoundByEmail) {
      throw new AuthorizationError(errors.authorizationEmailOrPassword);
    }

    const matchedPassword = await bcrypt.compare(password, userFoundByEmail.password);

    if (!matchedPassword) {
      throw new AuthorizationError(errors.authorizationEmailOrPassword);
    }

    const token = jwt.sign(
      { _id: userFoundByEmail._id },
      NODE_ENV === 'development' ? JWT_SECRET : 'very-secret-key',
      { expiresIn: '7d' },
    );

    return res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    })
      .status(201).send({
        message: messages.authentification,
        user: {
          name: userFoundByEmail.name,
          surname: userFoundByEmail.surname,
          patronymic: userFoundByEmail.patronymic,
          email: userFoundByEmail.email,
        },
      });
  } catch (err) {
    return next(err);
  }
};

// посмотреть, как переписать на async await функции с orFail
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(errors.notFoundUser))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError(errors.strangeRequest));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const {
    name,
    surname,
    patronymic,
    email,
  } = req.body;

  const { _id = '' } = req.user;

  User.findByIdAndUpdate(
    _id,
    {
      name,
      surname,
      patronymic,
      email,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(new NotFoundError(errors.notFoundUser))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === '[MongoError' && err.code === 11000) {
        return next(new ConflictError(errors.conflictEmail));
      }
      return next(err);
    });
};

const signOut = (req, res) => {
  const token = '';

  res.cookie('jwt', token, {
    httpOnly: true,
  })
    .status(201).send({
      message: messages.deleteCookie,
    });
};

const deleteUser = async (req, res, next) => {
  await User.findByIdAndRemove(req.user._id);

  const token = '';

  res.cookie('jwt', token, {
    httpOnly: true,
  })
    .status(201).send({
      message: messages.deleteYourAccount,
    });
};

module.exports = {
  getAllUsers,
  register,
  login,
  getCurrentUser,
  updateUser,
  signOut,
  deleteUser,
};
