const Timeline = require('../models/timeline');
const { localTimeWithoutSeconds } = require('../utils/time');
const messages = require('../constants/messages');

const getTimelineObject = (req, res, next) => {
  const timelinePointWithOwnerAndAffiliation = {
    ...req.body,
    owner: req.user._id,
    affiliation: req.params.deadPersonId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return timelinePointWithOwnerAndAffiliation;
};

const addNewTimelinePoint = async (req, res, next) => {
  const timelinePointWithOwnerAndAffiliation = getTimelineObject(req, res, next);

  const newTimelinePoint = await Timeline.create(timelinePointWithOwnerAndAffiliation);

  return res.status(200).send(newTimelinePoint);
};

const addNewTimelinePointWithPhoto = async (req, res, next) => {
  const timelinePointWithOwnerAndAffiliation = getTimelineObject(req, res, next);

  const timelinePointWithPhoto = {
    ...timelinePointWithOwnerAndAffiliation,
    photo: req.file.path,
  };

  const newTimelinePointWithPhoto = Timeline.create(timelinePointWithPhoto);

  return res.status(200).send(newTimelinePointWithPhoto);
};

const updateTimelinePoint = async (req, res, next) => {
  const updatedTimelinePoint = await Timeline.findByIdAndUpdate(
    req.params.timelinePointId,
    {
      ...req.body,
      edited: true,
      editedAt: localTimeWithoutSeconds(),
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );

  res.status(200).send(updatedTimelinePoint);
};

const getOneTimelinePoint = async (req, res, next) => {
  const currentTimelinePoint = await Timeline.findById(req.params.timelinePointId);

  return res.status(200).send(currentTimelinePoint);
};

const getAllTimelinePointsAboutOnePerson = async (req, res, next) => {
  const allTimelinePointsAboutOnePerson = await Timeline.find({
    affiliation: req.params.deadPersonId,
  });

  return res.status(200).send(allTimelinePointsAboutOnePerson);
};

const getAllTimelinePointsWhichOnePersonHasWritten = async (req, res, next) => {
  const allTimelinePointsWhichOnePersonHasWritten = await Timeline.find({ owner: req.user._id });

  return res.status(200).send(allTimelinePointsWhichOnePersonHasWritten);
};

const deleteTimelinePoint = async (req, res, next) => {
  await Timeline.findByIdAndRemove(req.params.timelinePointId);
  res.status(200).send({ message: messages.deleteTimelinePoint });
};

module.exports = {
  addNewTimelinePoint,
  addNewTimelinePointWithPhoto,
  updateTimelinePoint,
  getOneTimelinePoint,
  getAllTimelinePointsAboutOnePerson,
  getAllTimelinePointsWhichOnePersonHasWritten,
  deleteTimelinePoint,
};
