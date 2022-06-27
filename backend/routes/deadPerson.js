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
} = require('../middlewares/managingFolders');

const { validateDeadPersonInfo, validateDeadPersonId } = require('../middlewares/celebrate');

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
} = require('../controllers/deadPeople');

router.get('/', asyncHandler(getAllDeadPeople));

router.get('/:deadPersonId', validateDeadPersonId, asyncHandler(getDeadPerson));

router.post('/', validateDeadPersonInfo, asyncHandler(addNewDeadPerson));

router.patch('/:deadPersonId', validateDeadPersonId, validateDeadPersonInfo, asyncHandler(updateDeadPerson));

router.delete('/:deadPersonId', validateDeadPersonId, asyncHandler(deleteDeadPerson));

// ! Работа с фотографиями

router.patch(
  '/:deadPersonId/main-photo',
  validateDeadPersonId,
  createMainPhotoFolder,
  multer.uploadMainPhoto.single('main-photo'),
  asyncHandler(uploadMainPhoto),
);

router.delete(
  '/:deadPersonId/delete-main-photo',
  validateDeadPersonId,
  deleteMainPhotoFolder,
  asyncHandler(deleteMainPhotoFromDB),
);

router.patch(
  '/:deadPersonId/change-main-photo',
  validateDeadPersonId,
  getMainPhotoString,
  deleteMainPhotoFile,
  multer.uploadMainPhoto.single('main-photo'),
  asyncHandler(uploadMainPhoto),
);

router.patch(
  '/:deadPersonId/main-gallery',
  validateDeadPersonId,
  createMainGalleryFolder,
  multer.uploadMainGallery.array('main-gallery', 12),
  asyncHandler(uploadMainGallery),
);

router.patch(
  '/:deadPersonId/hobby-gallery',
  validateDeadPersonId,
  createHobbiesGalleryFolder,
  multer.uploadHobbyGallery.array('hobby-gallery', 12),
  asyncHandler(uploadHobbyGallery),
);

// ! роутинг воспоминаний
// ! и комментариев к ним - роутер комментов подключен в роутере воспоминаний

router.use('/:deadPersonId', validateDeadPersonId, memoryRouter);

router.use('/:deadPersonId', validateDeadPersonId, timelineRouter);

module.exports = router;
