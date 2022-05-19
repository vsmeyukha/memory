const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const multer = require('../middlewares/multer');

const memoryRouter = require('./memory');

const { createMainPhotoFolder, createMainGalleryFolder } = require('../middlewares/creatingFolders');

const {
  getAllDeadPeople,
  getDeadPerson,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
  uploadMainPhoto,
  uploadMainGallery,
} = require('../controllers/deadPeople');

router.get('/', asyncHandler(getAllDeadPeople));

router.get('/:deadPersonId', asyncHandler(getDeadPerson));

router.post('/', asyncHandler(addNewDeadPerson));

router.patch('/:deadPersonId', asyncHandler(updateDeadPerson));

router.delete('/:deadPersonId', asyncHandler(deleteDeadPerson));

// ! Работа с фотографиями

router.patch(
  '/:deadPersonId/main-photo',
  createMainPhotoFolder,
  multer.uploadMainPhoto.single('main-photo'),
  asyncHandler(uploadMainPhoto),
);

router.patch(
  '/:deadPersonId/main-gallery',
  createMainGalleryFolder,
  multer.uploadMainGallery.array('main-gallery', 12),
  asyncHandler(uploadMainGallery),
);

// ! роутинг воспоминаний
// ! и комментариев к ним - роутер комментов подключен в роутере воспоминаний

router.use('/:deadPersonId', memoryRouter);

module.exports = router;
