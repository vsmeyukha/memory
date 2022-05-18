const multer = require('multer');
const mongoose = require('mongoose');

const generateFileName = (file) => `${mongoose.Types.ObjectId().toString()}.${file.mimetype.slice(6)}`;

const mainPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/png'
      || file.mimetype === 'image/webp'
      ? null
      : new Error('wrong file');

    cb(error, `./uploads/${req.params.deadPersonId}/main-photo`);
  },
  filename: (req, file, cb) => {
    const error = file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/png'
      || file.mimetype === 'image/webp'
      ? null
      : new Error('wrong file');

    cb(error, `${generateFileName(file)}`);
  },
});

const mainGalleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/png'
      || file.mimetype === 'image/webp'
      ? null
      : new Error('wrong file');

    cb(error, `./uploads/${req.params.deadPersonId}/main-gallery`);
  },
  filename: (req, file, cb) => {
    const error = file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/png'
      || file.mimetype === 'image/webp'
      ? null
      : new Error('wrong file');

    cb(error, `${generateFileName(file)}`);
  },
});

const uploadMainPhoto = multer({ storage: mainPhotoStorage });
const uploadMainGallery = multer({ storage: mainGalleryStorage });

module.exports = { uploadMainPhoto, uploadMainGallery };
