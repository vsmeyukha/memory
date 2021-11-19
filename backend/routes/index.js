const router = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./me');
const deadPeopleRouter = require('./deadPerson');

router.use('/me', usersRouter);

router.use('/deadpeople', auth, deadPeopleRouter);

router.get('/', (req, res) => res.status(200).send({ message: 'polet norm' }));

module.exports = router;
