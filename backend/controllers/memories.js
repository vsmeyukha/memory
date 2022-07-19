const Memory = require('../models/memory');
const messages = require('../constants/messages');
const { localTimeWithoutSeconds } = require('../utils/time');
const errors = require('../constants/errors');
const CastError = require('../errors/castError');
const NotFoundError = require('../errors/notFoundError');

// ? создаем объект мемори, который будем переиспользовать несоклько раз в разных функциях
const getMemoryObject = (req) => {
  // ? сохраняем айдишник пользователя в переменную
  const owner = req.user._id;

  // ? сохраняем айдишник умершего человека в переменную
  const deadPerson = req.params.deadPersonId;

  // ? создаем новый объект воспоминания:
  // ? все поля, что были переданы в запросе, + owner и affiliation
  const memoryWithOwnerAndAffiliation = {
    ...req.body,
    owner,
    affiliation: deadPerson,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return memoryWithOwnerAndAffiliation;
};

// ! создаем воспоминание
const addNewMemory = async (req, res, next) => {
  const memoryWithOwnerAndAffiliation = getMemoryObject(req);

  // ? создаем новую запись в базе данных
  const newMemory = await Memory.create(memoryWithOwnerAndAffiliation);

  // ? отправляем созданное воспоминание на фронт
  return res.status(200).send(newMemory);
};

// ! создаем воспоминание с фото
const addNewMemoryWithPhoto = async (req, res, next) => {
  const memoryWithOwnerAndAffiliation = getMemoryObject(req);

  // ? создаем новый объект воспоминания:
  // ? все поля, что были переданы в запросе, + owner и affiliation
  const memoryWithPhoto = {
    ...memoryWithOwnerAndAffiliation,
    photo: req.file.path,
  };

  // ? создаем новую запись в базе данных
  const newMemoryWithPhoto = await Memory.create(memoryWithPhoto);

  return res.status(200).send(newMemoryWithPhoto);
};

// ! обновляем воспоминание
const updateMemory = async (req, res, next) => {
  try {
    const updatedMemory = await Memory.findByIdAndUpdate(
      req.params.memoryId,
      {
        ...req.body,
        edited: true,
        editedAt: localTimeWithoutSeconds(),
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    ).orFail(new NotFoundError(errors.notFoundMemory));

    return res.status(200).send(updatedMemory);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

const addReaction = async (req, res, next) => {
  try {
    const memoryWithAReaction = await Memory.findByIdAndUpdate(
      req.params.memoryId,
      {
        $addToSet:
          { reaction: req.user._id },
      },
      { new: true },
    ).orFail(new NotFoundError(errors.notFoundMemory));

    return res.status(200).send(memoryWithAReaction);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

const takeReactionBack = async (req, res, next) => {
  try {
    const memoryWithoutAReaction = await Memory.findByIdAndUpdate(
      req.params.memoryId,
      {
        $pull:
          { reaction: req.user._id },
      },
      { new: true },
    ).orFail(new NotFoundError(errors.notFoundMemory));

    return res.status(200).send(memoryWithoutAReaction);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

// ! получаем одно воспоминание
const getOneMemory = async (req, res, next) => {
  const currentMemory = await Memory.findById(req.params.memoryId)
    .orFail(new NotFoundError(errors.notFoundMemory));

  return res.status(200).send(currentMemory);
};

// ! получаем все воспоминания об одном человеке
const getAllMemoriesAboutOnePerson = async (req, res, next) => {
  // ? ищем в базе все воспоминания, относящиеся к одному человеку
  // ? то есть те, у которых в поле affiliation айдишник, переданный в req.params.deadPersonId
  const allMemoriesAboutOnePerson = await Memory.find({ affiliation: req.params.deadPersonId })
    .orFail(new NotFoundError(errors.notFoundMemory));

  // ? возвращаем все воспоминания на фронт
  return res.status(200).send(allMemoriesAboutOnePerson);
};

const getAllMemoriesWrittenByOnePerson = async (req, res, next) => {
  const allMemoriesWrittenByOnePerson = await Memory.find({ owner: req.user._id })
    .orFail(new NotFoundError(errors.notFoundMemory));

  return res.status(200).send(allMemoriesWrittenByOnePerson);
};

// ! удаляем воспоминание
const deleteMemory = async (req, res, next) => {
  await Memory.findByIdAndRemove(req.params.memoryId)
    .orFail(new NotFoundError(errors.notFoundMemory));

  return res.status(200).send({ message: messages.deleteMemory });
};

module.exports = {
  addNewMemory,
  addNewMemoryWithPhoto,
  updateMemory,
  addReaction,
  takeReactionBack,
  getOneMemory,
  getAllMemoriesAboutOnePerson,
  getAllMemoriesWrittenByOnePerson,
  deleteMemory,
};
