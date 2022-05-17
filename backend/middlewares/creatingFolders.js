const fsPromises = require('fs').promises;
const path = require('path');

const createMainPhotoFolder = (req, res, next) => {
  fsPromises.mkdir(path.join(`./uploads/${req.params.deadPersonId}/main-photo`), { recursive: true })
    .then(() => console.log(`папка ./uploads/${req.params.deadPersonId}/main-photo успешно создана`))
    .catch((err) => console.log(err));

  next();
};

module.exports = { createMainPhotoFolder };
