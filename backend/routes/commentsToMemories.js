const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const { validatecommentId } = require('../middlewares/celebrate');

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

router.get('/comments/:commentId', validatecommentId, asyncHandler(getCurrentComment));

router.patch('/comments/:commentId', validatecommentId, asyncHandler(updateComment));

router.delete('/comments/:commentId', validatecommentId, asyncHandler(deleteComment));

router.put('/comments/:commentId/reaction', validatecommentId, asyncHandler(addReaction));

router.delete('/comments/:commentId/reaction', validatecommentId, asyncHandler(takeReactionBack));

module.exports = router;
