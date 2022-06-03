const multer = require('multer');
const generateFileName = require('../utils/generateFileName');

const getError = (file) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    return null;
  } return new Error('wrong file');
};

const mainPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = getError(file);

    cb(error, `./uploads/dead-people/${req.params.deadPersonId}/main-photo`);
  },
  filename: (req, file, cb) => {
    const error = getError(file);

    cb(error, `${generateFileName(file)}`);
  },
});

const mainGalleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = getError(file);

    cb(error, `./uploads/dead-people/${req.params.deadPersonId}/main-gallery`);
  },
  filename: (req, file, cb) => {
    const error = getError(file);

    cb(error, `${generateFileName(file)}`);
  },
});

const memoryPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = getError(file);

    cb(error, `./uploads/dead-people/${req.params.deadPersonId}/memories/user${req.user._id}/memory${req.instanceId}`);
  },
  filename: (req, file, cb) => {
    const error = getError(file);

    cb(error, `${generateFileName(file)}`);
  },
});

const timelinePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = getError(file);

    cb(error, `./uploads/dead-people/${req.params.deadPersonId}/timeline/user${req.user._id}/timeline-point${req.instanceId}`);
  },
  filename: (req, file, cb) => {
    const error = getError(file);

    cb(error, `${generateFileName(file)}`);
  },
});

const uploadMainPhoto = multer({ storage: mainPhotoStorage });
const uploadMainGallery = multer({ storage: mainGalleryStorage });
const uploadMemoryPhoto = multer({ storage: memoryPhotoStorage });
const uploadTimelinePhoto = multer({ storage: timelinePhotoStorage });

module.exports = {
  uploadMainPhoto,
  uploadMainGallery,
  uploadMemoryPhoto,
  uploadTimelinePhoto,
};
