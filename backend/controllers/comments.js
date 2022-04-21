const Comment = require('../models/comment');
const messages = require('../constants/messages');

const addNewComment = async (req, res, next) => {
  const owner = req.user._id;

  // const { memoryId } = req.params.memoryId;

  const commentWithOwnerAndAffiliation = {
    ...req.body,
    owner,
    affiliation: req.params.memoryId,
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

const updateComment = async (req, res, next) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body,
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
