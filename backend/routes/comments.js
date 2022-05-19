const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const {
  addNewComment,
  getAllCommentsToOneMemory,
  getCurrentComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');

router.post('/add-new-comment', asyncHandler(addNewComment));

router.get('/comments', asyncHandler(getAllCommentsToOneMemory));

router.get('/comments/:commentId', asyncHandler(getCurrentComment));

router.patch('/comments/:commentId', asyncHandler(updateComment));

router.delete('/comments/:commentId', asyncHandler(deleteComment));

module.exports = router;
