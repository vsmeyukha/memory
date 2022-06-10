const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('express-async-handler');

const { addNewComment } = require('../controllers/commentsToTimeline');

router.post('/add-new-comment', asyncHandler(addNewComment));

module.exports = router;
