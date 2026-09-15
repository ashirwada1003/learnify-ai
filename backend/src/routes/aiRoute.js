const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const {askTutor} = require('../controllers/askTutor');

router.post('/courses/:courseId/ask-tutor',protectMiddleware,askTutor);

module.exports = router;