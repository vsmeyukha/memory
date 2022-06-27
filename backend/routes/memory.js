const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const commentsRouter = require('./commentsToMemories');

const createInstanceId = require('../middlewares/createInstanceId');
const { createMemoryPhotosFolder } = require('../middlewares/managingFolders');
const { uploadMemoryPhoto } = require('../middlewares/multer');
const { validateMemoryId } = require('../middlewares/celebrate');

const {
  addNewMemory,
  addNewMemoryWithPhoto,
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
  addReaction,
  takeReactionBack,
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

router.put('/memories/:memoryId/add-reaction', validateMemoryId, asyncHandler(addReaction));

router.delete('/memories/:memoryId/take-reaction-back', validateMemoryId, asyncHandler(takeReactionBack));

router.get('/memories', asyncHandler(getAllMemoriesAboutOnePerson));

router.delete('/memories/:memoryId', validateMemoryId, asyncHandler(deleteMemory));

router.get('/memories/:memoryId', validateMemoryId, asyncHandler(getOneMemory));

router.patch('/memories/:memoryId', validateMemoryId, asyncHandler(updateMemory));

// ! роутинг комментов

router.use('/memories/:memoryId', validateMemoryId, commentsRouter);

module.exports = router;
