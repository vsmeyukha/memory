const Memory = require('../models/memory');
const messages = require('../constants/messages');
const { localTimeWithoutSeconds } = require('../utils/time');

// ? создаем объект мемори, который будем переиспользовать несоклько раз в разных функциях
const getMemoryObject = (req, res, next) => {
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
  const memoryWithOwnerAndAffiliation = getMemoryObject(req, res, next);

  // ? создаем новую запись в базе данных
  const newMemory = await Memory.create(memoryWithOwnerAndAffiliation);

  // ? отправляем созданное воспоминание на фронт
  return res.status(200).send(newMemory);
};

// ! создаем воспоминание с фото
const addNewMemoryWithPhoto = async (req, res, next) => {
  const memoryWithOwnerAndAffiliation = getMemoryObject(req, res, next);

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
  );

  return res.status(200).send(updatedMemory);
};

const addReaction = async (req, res, next) => {
  const memoryWithAReaction = await Memory.findByIdAndUpdate(
    req.params.memoryId,
    {
      $addToSet:
        { reaction: req.user._id },
    },
    { new: true },
  );

  return res.status(200).send(memoryWithAReaction);
};

const takeRactionBack = async (req, res, next) => {
  const memoryWithoutAReaction = await Memory.findByIdAndUpdate(
    req.params.memoryId,
    {
      $pull:
        { reaction: req.user._id },
    },
    { new: true },
  );

  return res.status(200).send(memoryWithoutAReaction);
};

// ! получаем одно воспоминание
const getOneMemory = async (req, res, next) => {
  const currentMemory = await Memory.findById(req.params.memoryId);

  return res.status(200).send(currentMemory);
};

// ! получаем все воспоминания об одном человеке
const getAllMemoriesAboutOnePerson = async (req, res, next) => {
  // ? ищем в базе все воспоминания, относящиеся к одному человеку
  // ? то есть те, у которых в поле affiliation айдишник, переданный в req.params.deadPersonId
  const allMemoriesAboutOnePerson = await Memory.find({ affiliation: req.params.deadPersonId });

  // ? возвращаем все воспоминания на фронт
  return res.status(200).send(allMemoriesAboutOnePerson);
};

const getAllMemoriesWrittenByOnePerson = async (req, res, next) => {
  const allMemoriesWrittenByOnePerson = await Memory.find({ owner: req.user._id });

  return res.status(200).send(allMemoriesWrittenByOnePerson);
};

// ! удаляем воспоминание
const deleteMemory = async (req, res, next) => {
  await Memory.findByIdAndRemove(req.params.memoryId);
  return res.status(200).send({ message: messages.deleteMemory });
};

module.exports = {
  addNewMemory,
  addNewMemoryWithPhoto,
  updateMemory,
  addReaction,
  takeRactionBack,
  getOneMemory,
  getAllMemoriesAboutOnePerson,
  getAllMemoriesWrittenByOnePerson,
  deleteMemory,
};
