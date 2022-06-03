const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

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

router.get('/timeline/:timelinePointId', asyncHandler(getOneTimelinePoint));

router.get('/timeline', asyncHandler(getAllTimelinePointsAboutOnePerson));

router.delete('/timeline/:timelinePointId', asyncHandler(deleteTimelinePoint));

module.exports = router;
