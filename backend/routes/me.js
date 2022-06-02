const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const auth = require('../middlewares/auth');

const {
  getAllUsers,
  register,
  login,
  getCurrentUser,
  updateUser,
  signOut,
  deleteUser,
} = require('../controllers/users');

const { getAllTimelinePointsWhichOnePersonHasWritten } = require('../controllers/timelines');

router.get('/', auth, asyncHandler(getCurrentUser));

router.patch('/', auth, asyncHandler(updateUser));

router.post('/signout', auth, signOut);

router.post('/register', asyncHandler(register));

router.post('/login', asyncHandler(login));

router.delete('/', auth, asyncHandler(deleteUser));

router.get('/get-all-my-timeline-points', auth, asyncHandler(getAllTimelinePointsWhichOnePersonHasWritten));

// ? это тестовая история, ее потом надо будет подчистить
router.get('/allusers', asyncHandler(getAllUsers));

module.exports = router;
