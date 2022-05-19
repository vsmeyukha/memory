const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const commentsRouter = require('./comments');

const {
  addNewMemory,
  getAllMemoriesAboutOnePerson,
  deleteMemory,
  getOneMemory,
  updateMemory,
} = require('../controllers/memories');

router.post('/add-new-memory', asyncHandler(addNewMemory));

router.get('/memories', asyncHandler(getAllMemoriesAboutOnePerson));

router.delete('/memories/:memoryId', asyncHandler(deleteMemory));

router.get('/memories/:memoryId', asyncHandler(getOneMemory));

router.patch('/memories/:memoryId', asyncHandler(updateMemory));

// ! роутинг комментов

router.use('/memories/:memoryId', commentsRouter);

module.exports = router;
