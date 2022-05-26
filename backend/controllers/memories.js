const mongoose = require('mongoose');
const Memory = require('../models/memory');
const messages = require('../constants/messages');
const { createMemoryPhotosFolder } = require('../middlewares/creatingFolders');
const { uploadMemoryPhoto } = require('../middlewares/multer');

// ! создаем воспоминание
const addNewMemory = async (req, res, next) => {
  // ? сохраняем айдишник пользователя в переменную
  const owner = req.user._id;

  // ? сохраняем айдишник умершего человека в переменную
  const deadPerson = req.params.deadPersonId;

  // ? присваиваем посту _id случайно сгенерированное монгой значение
  const _id = mongoose.Types.ObjectId();

  // ? создаем новый объект воспоминания:
  // ?все поля, что были переданы в запросе, + owner и affiliation
  const memoryWithOwnerAndAffiliation = {
    _id,
    ...req.body,
    owner,
    affiliation: deadPerson,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // ? создаем новую запись в базе данных
  const newMemory = await Memory.create(memoryWithOwnerAndAffiliation);

  // ? отправляем созданное воспоминание на фронт
  return res.status(200).send(newMemory);
};

// ! создаем воспоминание с фото
// const addNewMemoryWithPhoto = async (req, res, next) => {
//   const owner = req.user._id;
//   const affiliation = req.params.deadPersonId;
//   const _id = mongoose.Types.ObjectId();

//   // ? создаем новый объект воспоминания:
//   // ? все поля, что были переданы в запросе, + owner и affiliation
//   const memoryWithOwnerAndAffiliation = {
//     _id,
//     owner,
//     affiliation,
//     ...req.body,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//   };

//   // ? создаем новую запись в базе данных
//   await Memory.create(memoryWithOwnerAndAffiliation);

//   await createMemoryPhotosFolder(req, res, next, _id);

//   uploadMemoryPhoto.single('memory-photo', _id);

//   const newMemoryWithPhoto = await Memory.findByIdAndUpdate(
//     _id,
//     { photo: req.file.path },
//     {
//       new: true,
//       runValidators: true,
//       upsert: true,
//     },
//   );

//   return res.status(200).send(newMemoryWithPhoto);
// };

const addNewMemoryWithPhoto = async (req, res, next) => {
  const owner = req.user._id;
  const affiliation = req.params.deadPersonId;

  // ? создаем новый объект воспоминания:
  // ? все поля, что были переданы в запросе, + owner и affiliation
  const memoryWithPhoto = {
    _id: req.memoryId,
    owner,
    affiliation,
    photo: req.file.path,
    ...req.body,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // ? создаем новую запись в базе данных
  const newMemoryWithPhoto = await Memory.create(memoryWithPhoto);

  return res.status(200).send(newMemoryWithPhoto);
};

// ! получаем все воспоминания об одном человеке
const getAllMemoriesAboutOnePerson = async (req, res, next) => {
  // ? сохраняем айдишник умершего человека в переменную
  const deadPerson = req.params.deadPersonId;

  // ? ищем в базе все воспоминания, относящиеся к одному человеку
  // ? то есть те, у которых в поле affiliation айдишник, переданный в req.params.deadPersonId
  const allMemoriesAboutOnePerson = await Memory.find({ affiliation: deadPerson });

  // ? возвращаем все воспоминания на фронт
  return res.status(200).send(allMemoriesAboutOnePerson);
};

// ! удаляем воспоминание
const deleteMemory = async (req, res, next) => {
  await Memory.findByIdAndRemove(req.params.memoryId);
  return res.status(200).send({ message: messages.deleteMemory });
};

// ! получаем одно воспоминание
const getOneMemory = async (req, res, next) => {
  const currentMemory = await Memory.findById(req.params.memoryId);

  return res.status(200).send(currentMemory);
};

// ! обновляем воспоминание
const updateMemory = async (req, res, next) => {
  const updatedMemory = await Memory.findByIdAndUpdate(
    req.params.memoryId,
    {
      ...req.body,
      edited: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );

  return res.status(200).send(updatedMemory);
};

module.exports = {
  addNewMemory,
  addNewMemoryWithPhoto,
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
};
