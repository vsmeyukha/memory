const Memory = require('../models/memory');
const messages = require('../constants/messages');

// ! создаем воспоминание
const addNewMemory = async (req, res, next) => {
  // ? сохраняем айдишник пользователя в переменную
  const owner = req.user._id;

  // ? сохраняем айдишник умершего человека в переменную
  const deadPerson = req.params.deadPersonId;

  // ? создаем новый объект воспоминания:
  // ?все поля, что были переданы в запросе, + owner и affiliation
  const memoryWithOwnerAndAffiliation = {
    ...req.body,
    owner,
    affiliation: deadPerson,
  };

  // ? создаем новую запись в базе данных
  const newMemory = await Memory.create(memoryWithOwnerAndAffiliation);

  // ? отправляем созданное воспоминание на фронт
  return res.status(200).send(newMemory);
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
    req.body,
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
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
};
