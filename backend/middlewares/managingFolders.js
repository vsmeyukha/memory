const fsPromises = require('fs').promises;
const path = require('path');

// const starting = `./uploads/${req.params.deadPersonId}`;
// ?  вот вопрос - хочется вынести повторяющуюся из функции в функцию часть адреса
// ? а это вызывает ошибку, посколько req не определено

const createMainPhotoFolder = (req, res, next) => {
  fsPromises.mkdir(
    path.join(`./uploads/dead-people/${req.params.deadPersonId}/main-photo`),
    { recursive: true },
  )
    .then(() => console.log(`папка ./uploads/dead-people/${req.params.deadPersonId}/main-photo успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const deleteMainPhotoFolder = (req, res, next) => {
  fsPromises.rmdir(
    path.join(`./uploads/dead-people/${req.params.deadPersonId}/main-photo`),
    {
      recursive: true,
      force: true,
    },
  );

  next();
};

const deleteMainPhotoFile = (req, res, next) => {
  fsPromises.unlink(path.join(`${req.mainPhoto}`))
    .then(() => console.log('photo successfully deleted'))
    .catch((err) => console.log(err));

  next();
};

// вот это непонятная хуйня. надо завтра подумать - откуда брать имя фото, которое надо удалять
// rmdir удаляет папку вместе с файлами. но этот способ нам подходит, только если мы удаляем main-photo, поскольку в этой папке, согласно нашей логике, должно быть не более одного фото. но этот способ не решает вопрос с галереей
// можно брать имя файла из базы, предварительно сходив в нее перед удалением. ищем в базе человека по req.params.deadPersonId и берем значение mainPhoto
// а вот с галереей как - хз. нуждно потолковать с сенсэем. по идее, на фронте у нас же есть имя файла. файл же как-то загружается. таким образом, когда ты его удаляешь, у тебя на фронте оно есть, значит, его можно прокинуть в req и оттуда точно так же достать. завтра надо тестить

const createMainGalleryFolder = (req, res, next) => {
  fsPromises.mkdir(
    path.join(`./uploads/dead-people/${req.params.deadPersonId}/main-gallery`),
    { recursive: true },
  )
    .then(() => console.log(`папка ./uploads/dead-people/${req.params.deadPersonId}/main-gallery успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const createHobbiesGalleryFolder = (req, res, next) => {
  fsPromises.mkdir(path.join(`./uploads/dead-people/${req.params.deadPersonId}/hobby-gallery`), { recursive: true })
    .then(() => console.log(`папка ./uploads/dead-people/${req.params.deadPersonId}/hobby-gallery успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const createMemoryPhotosFolder = (req, res, next) => {
  fsPromises.mkdir(
    path.join(`./uploads/dead-people/${req.params.deadPersonId}/memories/user${req.user._id}/memory${req.instanceId}`),
    { recursive: true },
  )
    .then(() => console.log(
      `папка ./uploads/dead-people/${req.params.deadPersonId}/memories/user${req.user._id}/memory${req.instanceId} успешно создана`,
    ))
    .catch((err) => console.log(err));

  next();
};

const createTimelinePhotosFolder = (req, res, next) => {
  fsPromises.mkdir(
    path.join(`./uploads/dead-people/${req.params.deadPersonId}/timeline/user${req.user._id}/timeline-point${req.instanceId}`),
    { recursive: true },
  )
    .then(() => console.log(
      `папка ./uploads/dead-people/${req.params.deadPersonId}/timeline/user${req.user._id}/timeline-point${req.instanceId} успешно создана`,
    ))
    .catch((err) => console.log(err));

  next();
};

const createUserAvatarFolder = (req, res, next) => {
  fsPromises.mkdir(
    path.join(`./uploads/users/${req.user._id}/avatar`),
    { recursive: true },
  )
    .then(() => console.log(`папка ./uploads/users/${req.user._id}/avatar успешно создана`))
    .catch((err) => console.log(err));

  next();
};

const deleteUserAvatarFolder = (req, res, next) => {
  fsPromises.rmdir(
    path.join(`./uploads/users/${req.user._id}/avatar`),
    {
      recursive: true,
      force: true,
    },
  )
    .then(() => console.log('folder and everything inside of it successfully deleted'))
    .catch((err) => console.log(err));

  next();
};

const deleteUserAvatarFile = (req, res, next) => {
  fsPromises.unlink(path.join(`${req.userAvatar}`))
    .then(() => console.log('user avatar successfully deleted'))
    .catch((err) => console.log(err));

  next();
};

module.exports = {
  createMainPhotoFolder,
  deleteMainPhotoFolder,
  deleteMainPhotoFile,
  createMainGalleryFolder,
  createHobbiesGalleryFolder,
  createMemoryPhotosFolder,
  createTimelinePhotosFolder,
  createUserAvatarFolder,
  deleteUserAvatarFolder,
  deleteUserAvatarFile,
};

// const creatingFileTest = () => {
//   fsPromises.writeFile(
//     path.join('./test-directory/test-file.txt'),
//     'bla-bla-bla',
//     (err) => {
//       if (err) console.log(err);
//     },
//   )
//     .then(() => console.log('файл успешно создан'))
//     .catch((err) => console.log(err));
// };
