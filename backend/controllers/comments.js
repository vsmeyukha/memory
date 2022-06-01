const Comment = require('../models/comment');
const messages = require('../constants/messages');
const { localTimeWithoutSeconds } = require('../utils/time');

const addNewComment = async (req, res, next) => {
  const owner = req.user._id;

  const commentWithOwnerAndAffiliation = {
    ...req.body,
    owner,
    affiliation: req.params.memoryId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const newComment = await Comment.create(commentWithOwnerAndAffiliation);

  return res.status(200).send(newComment);
};

const getAllCommentsToOneMemory = async (req, res, next) => {
  const allComments = await Comment.find({ affiliation: req.params.memoryId });

  return res.status(200).send(allComments);
};

const getCurrentComment = async (req, res, next) => {
  const currentComment = await Comment.findById(req.params.commentId);

  return res.status(200).send(currentComment);
};

// ? здесь в объект боди прокидываем время редактирования editedAt: localTimeWithoutSeconds
const updateComment = async (req, res, next) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      ...req.body,
      edited: true,
      editedAt: localTimeWithoutSeconds(),
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

const deleteComment = async (req, res, next) => {
  await Comment.findByIdAndRemove(req.params.commentId);
  return res.status(200).send({ message: messages.deleteComment });
};

module.exports = {
  addNewComment,
  getAllCommentsToOneMemory,
  getCurrentComment,
  updateComment,
  deleteComment,
};

// ? все комменты, аналогичные этому, искать в контроллере memories
