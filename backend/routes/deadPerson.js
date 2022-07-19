const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const multer = require('../middlewares/multer');

const memoryRouter = require('./memory');

const timelineRouter = require('./timeline');

const {
  createMainPhotoFolder,
  createMainGalleryFolder,
  createHobbiesGalleryFolder,
  deleteMainPhotoFile,
  deleteMainPhotoFolder,
  deletePhotoFileFromGallery,
} = require('../middlewares/managingFolders');

const { validateDeadPersonInfo, validateDeadPersonId, validateDeadPersonInfoForUpdating } = require('../middlewares/celebrate');

const {
  getAllDeadPeople,
  getDeadPerson,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
  uploadMainPhoto,
  uploadMainGallery,
  uploadHobbyGallery,
  deleteMainPhotoFromDB,
  getMainPhotoString,
  deletePhotoURLFromMainGallery,
  deletePhotoURLFromHobbyGallery,
} = require('../controllers/deadPeople');

// ! Роуты странички умершего человека

router.get('/', asyncHandler(getAllDeadPeople));

router.get('/:deadPersonId', validateDeadPersonId, asyncHandler(getDeadPerson));

router.post('/', validateDeadPersonInfo, asyncHandler(addNewDeadPerson));

router.patch('/:deadPersonId', validateDeadPersonId, validateDeadPersonInfoForUpdating, asyncHandler(updateDeadPerson));

router.delete('/:deadPersonId', validateDeadPersonId, asyncHandler(deleteDeadPerson));

// ! Работа с фотографиями

router.post(
  '/:deadPersonId/main-photo',
  validateDeadPersonId,
  createMainPhotoFolder,
  multer.uploadMainPhoto.single('main-photo'),
  asyncHandler(uploadMainPhoto),
);

router.delete(
  '/:deadPersonId/main-photo',
  validateDeadPersonId,
  deleteMainPhotoFolder,
  asyncHandler(deleteMainPhotoFromDB),
);

router.patch(
  '/:deadPersonId/main-photo',
  validateDeadPersonId,
  getMainPhotoString,
  multer.uploadMainPhoto.single('main-photo'),
  deleteMainPhotoFile,
  asyncHandler(uploadMainPhoto),
);

router.post(
  '/:deadPersonId/main-gallery',
  validateDeadPersonId,
  createMainGalleryFolder,
  multer.uploadMainGallery.array('main-gallery', 2),
  asyncHandler(uploadMainGallery),
);

router.delete(
  '/:deadPersonId/main-gallery',
  validateDeadPersonId,
  deletePhotoFileFromGallery,
  asyncHandler(deletePhotoURLFromMainGallery),
);

router.post(
  '/:deadPersonId/hobby-gallery',
  validateDeadPersonId,
  createHobbiesGalleryFolder,
  multer.uploadHobbyGallery.array('hobby-gallery', 12),
  asyncHandler(uploadHobbyGallery),
);

router.delete(
  '/:deadPersonId/hobby-gallery',
  validateDeadPersonId,
  deletePhotoFileFromGallery,
  asyncHandler(deletePhotoURLFromHobbyGallery),
);

// ! роутинг воспоминаний
// ! и комментариев к ним - роутер комментов подключен в роутере воспоминаний

router.use('/:deadPersonId', validateDeadPersonId, memoryRouter);

router.use('/:deadPersonId', validateDeadPersonId, timelineRouter);

module.exports = router;
