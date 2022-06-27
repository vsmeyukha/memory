const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');
const { accessSync } = require('fs');

const { validatecommentTotimelinePointId } = require('../middlewares/celebrate');

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

router.patch('/comments/:commentTotimelinePointId', validatecommentTotimelinePointId, asyncHandler(updateComment));

router.put('/comments/:commentTotimelinePointId/add-reaction', validatecommentTotimelinePointId, asyncHandler(addReaction));

router.delete('/comments/:commentTotimelinePointId/take-reaction-back', validatecommentTotimelinePointId, asyncHandler(takeReactionBack));

router.get('/comments', asyncHandler(getAllCommentsToOneTimelinePoint));

router.get('/comments/:commentTotimelinePointId', validatecommentTotimelinePointId, asyncHandler(getCurrentComment));

router.delete('/comments/:commentTotimelinePointId', validatecommentTotimelinePointId, asyncHandler(deleteComment));

module.exports = router;
