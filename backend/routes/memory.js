const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const commentsRouter = require('./commentsToMemories');

const createInstanceId = require('../middlewares/createInstanceId');
const { createMemoryPhotosFolder } = require('../middlewares/creatingFolders');
const { uploadMemoryPhoto } = require('../middlewares/multer');

const {
  addNewMemory,
  addNewMemoryWithPhoto,
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
  addReaction,
  takeRactionBack,
} = require('../controllers/memories');

router.post(
  '/add-new-memory',
  asyncHandler(addNewMemory),
);

// ? непонятно, как развести по урлу друг с другом создание простого воспоминания
// ? и воспоминания с фото
// ? ведь начинается у них все одинаково

router.post(
  '/add-new-memory-with-photo',
  createInstanceId,
  createMemoryPhotosFolder,
  uploadMemoryPhoto.single('memory-photo'),
  asyncHandler(addNewMemoryWithPhoto),
);

router.put('/memories/:memoryId/add-reaction', asyncHandler(addReaction));

router.delete('/memories/:memoryId/take-reaction-back', asyncHandler(takeRactionBack));

router.get('/memories', asyncHandler(getAllMemoriesAboutOnePerson));

router.delete('/memories/:memoryId', asyncHandler(deleteMemory));

router.get('/memories/:memoryId', asyncHandler(getOneMemory));

router.patch('/memories/:memoryId', asyncHandler(updateMemory));

// ! роутинг комментов

router.use('/memories/:memoryId', commentsRouter);

module.exports = router;
