const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const commentsRouter = require('./commentsToTimeline');

const createInstanceId = require('../middlewares/createInstanceId');
const { createTimelinePhotosFolder } = require('../middlewares/creatingFolders');
const { uploadTimelinePhoto } = require('../middlewares/multer');

const {
  addNewTimelinePoint,
  addNewTimelinePointWithPhoto,
  updateTimelinePoint,
  getOneTimelinePoint,
  getAllTimelinePointsAboutOnePerson,
  deleteTimelinePoint,
  addReaction,
  takeReactionBack,
} = require('../controllers/timelines');

router.post('/add-new-timeline-point', asyncHandler(addNewTimelinePoint));

router.post(
  '/add-new-timeline-point-with-photo',
  createInstanceId,
  createTimelinePhotosFolder,
  uploadTimelinePhoto.single('timeline-photo'),
  asyncHandler(addNewTimelinePointWithPhoto),
);

router.patch('/timeline/:timelinePointId', asyncHandler(updateTimelinePoint));

router.put('/timeline/:timelinePointId/add-reaction', asyncHandler(addReaction));

router.delete('/timeline/:timelinePointId/take-reaction-back', asyncHandler(takeReactionBack));

router.get('/timeline/:timelinePointId', asyncHandler(getOneTimelinePoint));

router.get('/timeline', asyncHandler(getAllTimelinePointsAboutOnePerson));

router.delete('/timeline/:timelinePointId', asyncHandler(deleteTimelinePoint));

router.use('/timeline/:timelinePointId', commentsRouter);

module.exports = router;
