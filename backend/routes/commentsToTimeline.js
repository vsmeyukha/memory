const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');
const { accessSync } = require('fs');

const {
  addNewComment,
  updateComment,
  addReaction,
  takeReactionBack,
  getCurrentComment,
  getAllCommentsToOneTimelinePoint,
  deleteComment,
} = require('../controllers/commentsToTimeline');

router.post('/add-new-comment', asyncHandler(addNewComment));

router.patch('/comments/:commentTotimelinePointId', asyncHandler(updateComment));

router.put('/comments/:commentTotimelinePointId/add-reaction', asyncHandler(addReaction));

router.delete('/comments/:commentTotimelinePointId/take-reaction-back', asyncHandler(takeReactionBack));

router.get('/comments/:commentTotimelinePointId', asyncHandler(getCurrentComment));

router.get('/comments', asyncHandler(getAllCommentsToOneTimelinePoint));

router.delete('/comments/:commentTotimelinePointId', asyncHandler(deleteComment));

module.exports = router;
