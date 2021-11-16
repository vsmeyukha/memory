const asyncHandler = require('express-async-handler');
const router = require('express').Router();

const usersRouter = require('./me');

router.use('/me', usersRouter);

router.get('/', (req, res) => res.status(200).send({ message: 'polet norm' }));

module.exports = router;
