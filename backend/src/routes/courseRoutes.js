const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const {createCourse,getAllCourses,getCourseById} = require('../controllers/courseController');


router.post('/courses',protectMiddleware,authorizeRoles('instructor','admin'),createCourse);

router.get('/courses',getAllCourses);
router.get('/courses/:id',getCourseById);

module.exports = router;