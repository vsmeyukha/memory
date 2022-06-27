const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const auth = require('../middlewares/auth');

const { validateEmailAndPassword, validateUserInfo, validateRegistration } = require('../middlewares/celebrate');

const {
  getAllUsers,
  register,
  login,
  getCurrentUser,
  updateUser,
  signOut,
  deleteUser,
} = require('../controllers/users');

const { getAllMemoriesWrittenByOnePerson } = require('../controllers/memories');

const { getAllTimelinePointsWhichOnePersonHasWritten } = require('../controllers/timelines');

const commentsToMemories = require('../controllers/commentsToMemories');

const commentsToTimeline = require('../controllers/commentsToTimeline');

router.get('/', auth, asyncHandler(getCurrentUser));

router.patch('/', auth, validateUserInfo, asyncHandler(updateUser));

router.post('/signout', auth, signOut);

router.post('/register', validateRegistration, asyncHandler(register));

router.post('/login', validateEmailAndPassword, asyncHandler(login));

router.delete('/', auth, asyncHandler(deleteUser));

router.get('/get-all-my-memories', auth, asyncHandler(getAllMemoriesWrittenByOnePerson));

router.get('/get-all-my-timeline-points', auth, asyncHandler(getAllTimelinePointsWhichOnePersonHasWritten));

router.get('/get-all-my-comments-to-memories', auth, asyncHandler(commentsToMemories.getAllCommentsWrittenByOnePerson));

router.get('/get-all-my-comments-to-timeline-points', auth, asyncHandler(commentsToTimeline.getAllCommentsWrittenByOnePerson));

// ? это тестовая история, ее потом надо будет подчистить
router.get('/allusers', asyncHandler(getAllUsers));

module.exports = router;
