const DeadPerson = require('../models/deadPerson');
const messages = require('../constants/messages');

const getAllDeadPeople = async (req, res, next) => {
  const allDeadPeople = await DeadPerson.find({});
  return res.status(200).send(allDeadPeople);
};

// тут наверное надо будет определить более конкретные сценарии ошибок.
// а общую ошибку отлавливает async handler в routes
const addNewDeadPerson = async (req, res, next) => {
  const owner = req.user._id;

  const deadManWithOwner = { ...req.body, owner };

  const newDeadPerson = await DeadPerson.create(deadManWithOwner);

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

module.exports = {
  getAllDeadPeople,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
};
