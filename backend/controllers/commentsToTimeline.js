const Comment = require('../models/commentToTimeline');
const messages = require('../constants/messages');
const { localTimeWithoutSeconds } = require('../utils/time');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/castError');
const errors = require('../constants/errors');

const addNewComment = async (req, res, next) => {
  const owner = req.user._id;

  const commentWithOwnerAndAffiliation = {
    ...req.body,
    owner,
    affiliation: req.params.timelinePointId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const newComment = await Comment.create(commentWithOwnerAndAffiliation);

  return res.status(200).send(newComment);
};

const updateComment = async (req, res, next) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentTotimelinePointId,
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
    ).orFail(new NotFoundError(errors.notFoundComment));

    return res.status(200).send(updatedComment);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

const addReaction = async (req, res, next) => {
  try {
    const commentWithAReaction = await Comment.findByIdAndUpdate(
      req.params.commentTotimelinePointId,
      {
        $addToSet:
          { reaction: req.user._id },
      },
      { new: true },
    ).orFail(new NotFoundError(errors.notFoundComment));

    return res.status(200).send(commentWithAReaction);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

const takeReactionBack = async (req, res, next) => {
  try {
    const commentWithoutAReaction = await Comment.findByIdAndUpdate(
      req.params.commentTotimelinePointId,
      {
        $pull:
          { reaction: req.user._id },
      },
      { new: true },
    ).orFail(new NotFoundError(errors.notFoundComment));

    return res.status(200).send(commentWithoutAReaction);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError(errors.strangeRequest));
    }
    return next(err);
  }
};

const getCurrentComment = async (req, res, next) => {
  const currentComment = await Comment.findById(req.params.commentTotimelinePointId)
    .orFail(new NotFoundError(errors.notFoundComment));

  return res.status(200).send(currentComment);
};

const getAllCommentsToOneTimelinePoint = async (req, res, next) => {
  const allComments = await Comment.find({ affiliation: req.params.timelinePointId })
    .orFail(new NotFoundError(errors.notFoundComment));

  return res.status(200).send(allComments);
};

const getAllCommentsWrittenByOnePerson = async (req, res, next) => {
  const allCommentsWrittenByOnePerson = await Comment.find({ owner: req.user._id })
    .orFail(new NotFoundError(errors.notFoundComment));

  return res.status(200).send(allCommentsWrittenByOnePerson);
};

const deleteComment = async (req, res, next) => {
  await Comment.findByIdAndRemove(req.params.commentTotimelinePointId)
    .orFail(new NotFoundError(errors.notFoundComment));

  return res.status(200).send({ message: messages.deleteComment });
};

module.exports = {
  addNewComment,
  updateComment,
  addReaction,
  takeReactionBack,
  getCurrentComment,
  getAllCommentsToOneTimelinePoint,
  getAllCommentsWrittenByOnePerson,
  deleteComment,
};
