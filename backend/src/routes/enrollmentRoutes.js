const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const {enrollStudent} = require('../controllers/enrollmentController');

router.post('/courses/:courseId/enroll',protectMiddleware,enrollStudent);

module.exports = router;