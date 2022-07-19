const { celebrate, Joi, CelebrateError, Segments } = require('celebrate');
const validator = require('validator');
const mongoose = require('mongoose');
const CastError = require('../errors/castError');
const messages = require('../constants/messages');

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

const err = new CelebrateError('email неправильный!', { celebrated: true });

const userInfo = {
  ...anyPerson,
  email: Joi.string()
    .required()
    .email()
    .label('Email')
    .error(err),
  dateOfBirth: Joi.date(),
};

// err.details.set(Segments.BODY, userInfo.email.error);

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

const deadPersonInfoForUpdating = {
  name: Joi.string().min(2).max(30),
  surname: Joi.string().min(2).max(30),
  patronymic: Joi.string().min(2).max(30),
  sex: Joi.bool(),
  mainPhoto: Joi.string(),
  dateOfBirth: Joi.date(),
  dateOfDeath: Joi.date(),
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

const validateDeadPersonInfoForUpdating = celebrate({
  body: Joi.object().keys(deadPersonInfoForUpdating),
});

const validateDeadPersonId = celebrate({
  params: Joi.object().keys({
    deadPersonId: Joi.required().custom(validateMongoId),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.required().custom(validateMongoId),
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
  validateUserId,
  validateMemoryId,
  validateTimelinePointId,
  validatecommentId,
  validatecommentTotimelinePointId,
  validateDeadPersonInfoForUpdating,
};
