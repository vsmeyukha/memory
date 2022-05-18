const fsPromises = require('fs').promises;
const path = require('path');

// const starting = `./uploads/${req.params.deadPersonId}`;
// ?  вот вопрос - хочется вынести повторяющуюся из функции в функцию часть адреса
// ? а это вызывает ошибку, посколько req не определено

const createMainPhotoFolder = (req, res, next) => {
  fsPromises.mkdir(path.join(`./uploads/${req.params.deadPersonId}/main-photo`), { recursive: true })
    .then(() => console.log(`папка ./uploads/${req.params.deadPersonId}/main-photo успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const createMainGalleryFolder = (req, res, next) => {
  fsPromises.mkdir(path.join(`./uploads/${req.params.deadPersonId}/main-gallery`), { recursive: true })
    .then(() => console.log(`папка ./uploads/${req.params.deadPersonId}/main-gallery успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const createHobbiesGalleryFolder = (req, res, next) => {
  fsPromises.mkdir(path.join(`./uploads/${req.params.deadPersonId}/hobbies-gallery`), { recursive: true })
    .then(() => console.log(`папка ./uploads/${req.params.deadPersonId}/hobbies-gallery успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const createMemoryPhotosFolder = (req, res, next, memory) => {
  fsPromises.mkdir(
    path.join(`./uploads/${req.params.deadPersonId}/users/${req.user._id}/memories/${memory._id}`),
    { recursive: true },
  )
    .then(() => console.log(
      `папка ./uploads/${req.params.deadPersonId}/users/${req.user._id}/memories/${memory._id} успешно создана`,
    ))
    .catch((err) => console.log(err));

  next();
};

module.exports = {
  createMainPhotoFolder,
  createMainGalleryFolder,
  createHobbiesGalleryFolder,
  createMemoryPhotosFolder,
};
