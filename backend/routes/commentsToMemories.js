const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const {
  addNewComment,
  getAllCommentsToOneMemory,
  getCurrentComment,
  updateComment,
  deleteComment,
  addReaction,
  takeReactionBack,
} = require('../controllers/commentsToMemories');

router.post('/add-new-comment', asyncHandler(addNewComment));

router.get('/comments', asyncHandler(getAllCommentsToOneMemory));

router.get('/comments/:commentId', asyncHandler(getCurrentComment));

router.patch('/comments/:commentId', asyncHandler(updateComment));

router.delete('/comments/:commentId', asyncHandler(deleteComment));

router.put('/comments/:commentId/add-reaction', asyncHandler(addReaction));

router.delete('/comments/:commentId/take-reaction-back', asyncHandler(takeReactionBack));

module.exports = router;
