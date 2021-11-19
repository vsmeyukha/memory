const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const { getAllDeadPeople, addNewDeadPerson, updateDeadPerson, deleteDeadPerson } = require('../controllers/deadPeople');

router.get('/', asyncHandler(getAllDeadPeople));

router.post('/', asyncHandler(addNewDeadPerson));

router.patch('/:deadPersonId', asyncHandler(updateDeadPerson));

router.delete('/:deadPersonId', asyncHandler(deleteDeadPerson));

module.exports = router;
