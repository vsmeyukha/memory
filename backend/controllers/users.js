// ! шифрование пароля и генерация токена
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ! тексты
const errors = require('../constants/errors');
const messages = require('../constants/messages');

// ! ошибочки
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/authorizationError');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/castError');

// ! модель
const User = require('../models/user');

// ? по возможности используем синтаксис async await

// ! получаем всех пользователей
const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({});
  return res.status(200).send(allUsers);
};

const getOneUser = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.userId)
      .orFail(new NotFoundError(errors.notFoundUser));

    return res.status(200).send(foundUser);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

// ! регистрируемся
const register = async (req, res, next) => {
  try {
    // ? деструктурируем тело запроса, присваиваем поля ответа переменным
    const {
      name,
      surname,
      patronymic,
      sex,
      dateOfBirth,
      mainPhoto,
      email,
      password,
    } = req.body;

    // ? шифруем пароль
    const encryptedPassword = await bcrypt.hash(password, 10);

    // ? создаем нового юзера,
    // ? только вместо введенного пользователем пароля сохраняем в базу зашифрованный
    const userWithEncryptedPassword = await User.create({
      name,
      surname,
      patronymic,
      sex,
      dateOfBirth,
      mainPhoto,
      email,
      password: encryptedPassword,
    }).orFail(new CastError(errors.invalidEmail));

    // ? а в ответе не возвращаем зашифрованный пароль, он уходит только в базу
    return res.status(200).send({
      name: userWithEncryptedPassword.name,
      surname: userWithEncryptedPassword.surname,
      patronymic: userWithEncryptedPassword.patronymic,
      sex: userWithEncryptedPassword.sex,
      dateOfBirth: userWithEncryptedPassword.dateOfBirth,
      mainPhoto: userWithEncryptedPassword.mainPhoto,
      email: userWithEncryptedPassword.email,
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return next(new ConflictError(errors.conflictEmail));
    }
    return next(err);
  }
};

// ! логинимся
const login = async (req, res, next) => {
  try {
    const { NODE_ENV, JWT_SECRET = 'very-secret-key' } = process.env;

    // ? деструктурируем запрос
    const { email, password } = req.body;

    // ? ищем юзера по емэйлу
    // ? если не найдем, выбрасываем ошибку авторизации - неправильный емэйл или пассворд
    const userFoundByEmail = await User.findOne({ email }).select('+password')
      .orFail(new AuthorizationError(errors.authorizationEmailOrPassword));

    // ? если емэйл совпал, сравниваем введенный пользователем пароль с хранящимся в базе паролем
    const matchedPassword = await bcrypt.compare(password, userFoundByEmail.password);

    // ? если не совпал, выбрасываем ошибку авторизации
    if (!matchedPassword) {
      throw new AuthorizationError(errors.authorizationEmailOrPassword);
    }

    // ? если все совпало, и в базе найден такой емэйл с таким паролем, то создаем токен.
    // ? в токен записываем только айдишник пользователя.этого вполне достаточно для идентификации.
    // ? и не приходится гонять большие пакеты данных туда-сюда
    // ? задаем срок годности токена. обычно 7 дней.
    // ? в это время чел может заходить на сайт, не перезалогиниваясь.
    // ? когда токен протухнет, придется заново ввести логин и пароль
    const token = jwt.sign(
      { _id: userFoundByEmail._id },
      NODE_ENV === 'development' ? JWT_SECRET : 'very-secret-key',
      { expiresIn: '7d' },
    );

    // ? в ответе возвращаем куку, в нее записываем токен.
    // ? также задаем срок хранения куки, в нашем случае он совпадает со сроком годности токена.
    // ? httpOnly: true очень важно прописать, поскольку это обеспечивает безопасность куки и сайта.
    // ? из JS теперь не достанешь куку
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

// ! ищем конкретного пользователя.
// ! применяется, когда, например, заходим в личный кабинет. отдает данные юзера на фронт
// ? посмотреть, как переписать на async await функции с orFail
const getCurrentUser = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.user._id)
      .orFail(new NotFoundError(errors.notFoundUser));

    return res.status(200).send(foundUser);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

// ! обновление данных о юзере. работает также, как и поиск конкретного.
// ! только записывает новые данные в базу
const updateUser = async (req, res, next) => {
  try {
    const {
      name,
      surname,
      patronymic,
      email,
      sex,
      dateOfBirth,
      mainPhoto,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        surname,
        patronymic,
        email,
        sex,
        dateOfBirth,
        mainPhoto,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
      .orFail(new NotFoundError(errors.notFoundUser));

    return res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === '[MongoError' && err.code === 11000) {
      return next(new ConflictError(errors.conflictEmail));
    }
    return next(err);
  }
};

// ! разлогин. в токен записываем пустую строку, токен отправляем в куку
// ! теперь уже без всяких сроков годности, ибо по факту ничего в токене и не хранится
const signOut = (req, res) => {
  const token = '';

  res.cookie('jwt', token, {
    httpOnly: true,
  })
    .status(201)
    .send({ message: messages.deleteCookie });
};

// ! удаляем пользователя
// ! ищем по айди и удаляем из базы
// ! в токен записываем пустую строку
// ! отправляем токен в куку
// ! отправляем ответ, что ваш акк удален
const deleteUser = async (req, res, next) => {
  await User.findByIdAndRemove(req.user._id).orFail(new NotFoundError(errors.notFoundUser));

  const token = '';

  res.cookie('jwt', token, {
    httpOnly: true,
  })
    .status(201)
    .send({ message: messages.deleteYourAccount });
};

const uploadAvatar = async (req, res, next) => {
  const userWithAvatar = await User.findByIdAndUpdate(
    req.user._id,
    { mainPhoto: req.file.path },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(userWithAvatar);
};

const getAvatarString = async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  req.userAvatar = currentUser.mainPhoto;

  next();
};

const deleteAvatar = async (req, res, next) => {
  const userWithoutAvatar = await User.findByIdAndUpdate(
    req.user._id,
    { mainPhoto: '' },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(userWithoutAvatar);
};

module.exports = {
  getAllUsers,
  getOneUser,
  register,
  login,
  getCurrentUser,
  updateUser,
  signOut,
  deleteUser,
  uploadAvatar,
  getAvatarString,
  deleteAvatar,
};
