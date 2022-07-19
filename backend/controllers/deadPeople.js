const DeadPerson = require('../models/deadPerson');
const messages = require('../constants/messages');
const deadPerson = require('../models/deadPerson');
const errors = require('../constants/errors');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/castError');

const getAllDeadPeople = async (req, res, next) => {
  const allDeadPeople = await DeadPerson.find({});
  return res.status(200).send(allDeadPeople);
};

const getDeadPerson = async (req, res, next) => {
  try {
    const deadMan = await DeadPerson.findById(req.params.deadPersonId)
      .orFail(new NotFoundError(errors.notFoundDeadPerson));

    return res.status(200).send(deadMan);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

// ! добавляем нового умершего человека
// тут наверное надо будет определить более конкретные сценарии ошибок.
// а общую ошибку отлавливает async handler в routes
const addNewDeadPerson = async (req, res, next) => {
  // ? проверяем,не зарегистрировал ли уже кто-то человека с таким же ФИО,датами рождения и смерти

  const matchedDeadPeople = await DeadPerson.find({
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
  });

  if (matchedDeadPeople.length !== 0) {
    throw new ConflictError({
      message: errors.conflictInDatabase,
      additionalInfo: matchedDeadPeople,
    });
  } else {
    // ? сохраняем айдишник пользователя в переменную
    const owner = req.user._id;

    // ? создаем новый объект - в нем все поля из тела запроса + айдишник пользователя
    // ? который у нас сохранен в переменную owner
    const deadManWithOwner = { ...req.body, owner };

    // ? создаем новую запись в базе. отправляем в базу выше созданный объект
    const newDeadPerson = await DeadPerson.create(deadManWithOwner);

    // ? отправляем в ответ нового созданного умершего
    return res.status(200).send(newDeadPerson);
  }
};

const updateDeadPerson = async (req, res, next) => {
  // ? проверяем, не изменяет ли юзер данные человека на данные
  // ? совпадающие полностью с данными другого человека
  const matchedDeadPeople = await DeadPerson.find({
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
  });

  if (matchedDeadPeople.length !== 0) {
    throw new ConflictError({
      message: errors.conflictInDatabase,
      additionalInfo: matchedDeadPeople,
    });
  } else {
    const updatedDeadPerson = await DeadPerson.findByIdAndUpdate(
      req.params.deadPersonId,
      req.body,
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    ).orFail(new NotFoundError(errors.notFoundDeadPerson));

    return res.status(200).send(updatedDeadPerson);
  }
};

const deleteDeadPerson = async (req, res, next) => {
  await DeadPerson.findByIdAndRemove(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  return res.status(200).send({ message: messages.deleteDeadPerson });
};

const uploadMainPhoto = async (req, res, next) => {
  const deadPersonWithMainPhoto = await DeadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { mainPhoto: req.file.path },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(deadPersonWithMainPhoto);
};

const getMainPhotoString = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  req.mainPhoto = deadMan.mainPhoto;

  next();
};

const deleteMainPhotoFromDB = async (req, res, next) => {
  const deadManWithoutMainPhoto = await DeadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { mainPhoto: '' },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new NotFoundError(errors.notFoundDeadPerson));

  return res.status(200).send(deadManWithoutMainPhoto);
};

const uploadMainGallery = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  const photoLinks = deadMan.mainGallery;

  for (let i = 0; i < req.files.length; i++) {
    photoLinks.push(req.files[i].path);
  }

  const deadPersonWithMainGallery = await DeadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { mainGallery: photoLinks },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(deadPersonWithMainGallery);
};

const deletePhotoURLFromMainGallery = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  const photosWithoutChosenPhoto = deadMan.mainGallery.filter((item) => item !== req.body.photo);

  const deadManWithEditedMainGallery = await deadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { mainGallery: photosWithoutChosenPhoto },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(deadManWithEditedMainGallery);
};

const uploadHobbyGallery = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  const photoLinks = deadMan.hobbyGallery;

  for (let i = 0; i < req.files.length; i++) {
    photoLinks.push(req.files[i].path);
  }

  const deadPersonWithHobbyGallery = await DeadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { hobbyGallery: photoLinks },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(deadPersonWithHobbyGallery);
};

const deletePhotoURLFromHobbyGallery = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId)
    .orFail(new NotFoundError(errors.notFoundDeadPerson));

  const photosWithoutChosenPhoto = deadMan.hobbyGallery.filter((item) => item !== req.body.photo);

  const deadManWithEditedHobbyGallery = await deadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    { hobbyGallery: photosWithoutChosenPhoto },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).orFail(new CastError(errors.strangeRequest));

  return res.status(200).send(deadManWithEditedHobbyGallery);
};

module.exports = {
  getAllDeadPeople,
  getDeadPerson,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
  uploadMainPhoto,
  uploadMainGallery,
  uploadHobbyGallery,
  deleteMainPhotoFromDB,
  getMainPhotoString,
  deletePhotoURLFromMainGallery,
  deletePhotoURLFromHobbyGallery,
};
