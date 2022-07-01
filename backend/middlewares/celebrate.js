const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const mongoose = require('mongoose');

const validateMongoId = (mongoId) => {
  const result = mongoose.Types.ObjectId.isValid(mongoId);
  if (result) {
    return mongoId;
  } throw new Error('mongoose ObjectId in params is wrong');
};

const EmailAndPassword = {
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
};

const anyPerson = {
  name: Joi.string().required().min(2).max(30),
  surname: Joi.string().required().min(2).max(30),
  patronymic: Joi.string().min(2).max(30),
  sex: Joi.bool(),
  mainPhoto: Joi.string(),
};

const userInfo = {
  ...anyPerson,
  email: Joi.string().required().email(),
  dateOfBirth: Joi.date(),
};

const deadPersonInfo = {
  ...anyPerson,
  dateOfBirth: Joi.date().required(),
  dateOfDeath: Joi.date().required(),
  placeOfBirth: Joi.string(),
  placeofDeath: Joi.string(),
  description: Joi.string().min(2).max(2000),
  mainGallery: Joi.array(),
  hobbyGallery: Joi.array(),
};

const validateEmailAndPassword = celebrate({
  body: Joi.object().keys(EmailAndPassword),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys(userInfo),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({ ...userInfo, ...EmailAndPassword }),
});

const validateDeadPersonInfo = celebrate({
  body: Joi.object().keys(deadPersonInfo),
});

const validateDeadPersonId = celebrate({
  params: Joi.object().keys({
    deadPersonId: Joi.required().custom(validateMongoId),
  }),
});

const validateMemoryId = celebrate({
  params: Joi.object().keys({
    memoryId: Joi.required().custom(validateMongoId),
  }).unknown(true),
});

const validateTimelinePointId = celebrate({
  params: Joi.object().keys({
    timelinePointId: Joi.required().custom(validateMongoId),
  }).unknown(true),
});

const validatecommentId = celebrate({
  params: Joi.object().keys({
    commentId: Joi.required().custom(validateMongoId),
  }).unknown(true),
});

const validatecommentTotimelinePointId = celebrate({
  params: Joi.object().keys({
    commentToTimelinePointId: Joi.required().custom(validateMongoId),
  }).unknown(true),
});

module.exports = {
  validateEmailAndPassword,
  validateUserInfo,
  validateRegistration,
  validateDeadPersonInfo,
  validateDeadPersonId,
  validateMemoryId,
  validateTimelinePointId,
  validatecommentId,
  validatecommentTotimelinePointId,
};
