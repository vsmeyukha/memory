const Comment = require('../models/commentToTimeline');
const messages = require('../constants/messages');
const { localTimeWithoutSeconds } = require('../utils/time');

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
  );

  return res.status(200).send(updatedComment);
};

const addReaction = async (req, res, next) => {
  const commentWithAReaction = await Comment.findByIdAndUpdate(
    req.params.commentTotimelinePointId,
    {
      $addToSet:
        { reaction: req.user._id },
    },
    { new: true },
  );

  return res.status(200).send(commentWithAReaction);
};

const takeReactionBack = async (req, res, next) => {
  const commentWithoutAReaction = await Comment.findByIdAndUpdate(
    req.params.commentTotimelinePointId,
    {
      $pull:
        { reaction: req.user._id },
    },
    { new: true },
  );

  return res.status(200).send(commentWithoutAReaction);
};

const getCurrentComment = async (req, res, next) => {
  const currentComment = await Comment.findById(req.params.commentTotimelinePointId);

  return res.status(200).send(currentComment);
};

const getAllCommentsToOneTimelinePoint = async (req, res, next) => {
  const allComments = await Comment.find({ affiliation: req.params.timelinePointId });

  return res.status(200).send(allComments);
};

const getAllCommentsWrittenByOnePerson = async (req, res, next) => {
  const allCommentsWrittenByOnePerson = await Comment.find({ owner: req.user._id });

  return res.status(200).send(allCommentsWrittenByOnePerson);
};

const deleteComment = async (req, res, next) => {
  await Comment.findByIdAndRemove(req.params.commentTotimelinePointId);
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
