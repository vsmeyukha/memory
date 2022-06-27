const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const commentsRouter = require('./commentsToTimeline');

const createInstanceId = require('../middlewares/createInstanceId');
const { createTimelinePhotosFolder } = require('../middlewares/managingFolders');
const { uploadTimelinePhoto } = require('../middlewares/multer');
const { validateTimelinePointId } = require('../middlewares/celebrate');

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

router.patch('/timeline/:timelinePointId', validateTimelinePointId, asyncHandler(updateTimelinePoint));

router.put('/timeline/:timelinePointId/add-reaction', validateTimelinePointId, asyncHandler(addReaction));

router.delete('/timeline/:timelinePointId/take-reaction-back', validateTimelinePointId, asyncHandler(takeReactionBack));

router.get('/timeline/:timelinePointId', validateTimelinePointId, asyncHandler(getOneTimelinePoint));

router.get('/timeline', asyncHandler(getAllTimelinePointsAboutOnePerson));

router.delete('/timeline/:timelinePointId', validateTimelinePointId, asyncHandler(deleteTimelinePoint));

router.use('/timeline/:timelinePointId', validateTimelinePointId, commentsRouter);

module.exports = router;
