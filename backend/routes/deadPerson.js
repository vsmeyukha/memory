const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const upload = require('../middlewares/multer');

const {
  getAllDeadPeople,
  getDeadPerson,
  addNewDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
  uploadMainPhoto,
} = require('../controllers/deadPeople');

const {
  addNewMemory,
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
} = require('../controllers/memories');

const {
  addNewComment,
  getAllCommentsToOneMemory,
  getCurrentComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');

router.get('/', asyncHandler(getAllDeadPeople));

router.get('/:deadPersonId', asyncHandler(getDeadPerson));

router.post('/', asyncHandler(addNewDeadPerson));

router.patch('/:deadPersonId', asyncHandler(updateDeadPerson));

router.delete('/:deadPersonId', asyncHandler(deleteDeadPerson));

// ! Работа с фотографиями

router.patch('/:deadPersonId/main-photo', upload.single('main-photo'), asyncHandler(uploadMainPhoto));

// ! роутинг воспоминаний

router.post('/:deadPersonId', asyncHandler(addNewMemory));

router.get('/:deadPersonId/memories', asyncHandler(getAllMemoriesAboutOnePerson));

router.delete('/:deadPersonId/memories/:memoryId', asyncHandler(deleteMemory));

router.get('/:deadPersonId/memories/:memoryId', asyncHandler(getOneMemory));

router.patch('/:deadPersonId/memories/:memoryId', asyncHandler(updateMemory));

// ! роутинг комментариев к воспоминаниям

router.post('/:deadPersonId/memories/:memoryId', asyncHandler(addNewComment));

router.get('/:deadPersonId/memories/:memoryId/comments', asyncHandler(getAllCommentsToOneMemory));

router.get('/:deadPersonId/memories/:memoryId/comments/:commentId', asyncHandler(getCurrentComment));

router.patch('/:deadPersonId/memories/:memoryId/comments/:commentId', asyncHandler(updateComment));

router.delete('/:deadPersonId/memories/:memoryId/comments/:commentId', asyncHandler(deleteComment));

// ! когда-нибудь разобраться:
// !не работает роутинг воспоминаний, если вынести роуты воспоминаний в отдельный файл
// ! например, вот так - router.use('/:deadPersonId', memoryRouter);
// ! не подсасывает данные из req.params.deadPersonId

module.exports = router;
