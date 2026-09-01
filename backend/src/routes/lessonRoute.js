const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const {createLesson} = require('../controllers/lessonController');

router.post('/courses/:courseId/lessons',protectMiddleware,authorizeRoles('instructor','admin'),createLesson);

module.exports = router;