const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
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

    cb(error, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
