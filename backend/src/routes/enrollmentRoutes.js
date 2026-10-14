const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const {enrollStudent,getMyEnrollments} = require('../controllers/enrollmentController');

router.post('/courses/:courseId/enroll',protectMiddleware,enrollStudent);
router.get('/my-enrollments', protectMiddleware, getMyEnrollments);

module.exports = router;