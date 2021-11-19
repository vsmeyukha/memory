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

router.get('/', auth, asyncHandler(getCurrentUser));

router.patch('/', auth, asyncHandler(updateUser));

router.post('/signout', auth, signOut);

router.post('/register', asyncHandler(register));

router.post('/login', asyncHandler(login));

router.delete('/', auth, asyncHandler(deleteUser));

// ? это тестовая история, ее потом надо будет подчистить
router.get('/allusers', asyncHandler(getAllUsers));

module.exports = router;
