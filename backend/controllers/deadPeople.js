const DeadPerson = require('../models/deadPerson');
const messages = require('../constants/messages');

const getAllDeadPeople = async (req, res, next) => {
  const allDeadPeople = await DeadPerson.find({});
  return res.status(200).send(allDeadPeople);
};

const getDeadPerson = async (req, res, next) => {
  const deadMan = await DeadPerson.findById(req.params.deadPersonId);
  return res.status(200).send(deadMan);
};

// ! добавляем нового умершего человека
// тут наверное надо будет определить более конкретные сценарии ошибок.
// а общую ошибку отлавливает async handler в routes
const addNewDeadPerson = async (req, res, next) => {
  // ? сохраняем айдишник пользователя в переменную
  const owner = req.user._id;

  // ? создаем новый объект - в нем все поля из тела запроса + айдишник пользователя
  // ? который у нас сохранен в переменную owner
  const deadManWithOwner = { ...req.body, owner };

  // ? создаем новую запись в базе. отправляем в базу выше созданный объект
  const newDeadPerson = await DeadPerson.create(deadManWithOwner);

  // ? отправляем в ответ нового созданного умершего
  return res.status(200).send(newDeadPerson);
};

const updateDeadPerson = async (req, res, next) => {
  const updatedDeadPerson = await DeadPerson.findByIdAndUpdate(
    req.params.deadPersonId,
    req.body,
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );
  return res.status(200).send(updatedDeadPerson);
};

const deleteDeadPerson = async (req, res, next) => {
  await DeadPerson.findByIdAndRemove(req.params.deadPersonId);
  return res.status(200).send({ message: messages.deleteDeadPerson });
};

// const addAMemory = async (req, res, next) => {
//   const { memory } = req.body.memory;

//   const owner = req.user._id;

//   const memoryWithUserId = { ...memory, owner };

//   const newMemory = await DeadPerson.findByIdAndUpdate(
//     req.params.deadPersonId,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//       upsert: true,
//     },
//   );

//   return res.status(200).send(newMemory);
// };

module.exports = {
  getAllDeadPeople,
  getDeadPerson,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
};
