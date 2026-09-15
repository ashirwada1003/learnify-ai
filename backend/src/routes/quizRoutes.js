const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { generateQuizController } = require('../controllers/quizController');

router.post(
  '/lessons/:lessonId/generate-quiz',protectMiddleware,authorizeRoles('instructor', 'admin'),generateQuizController
);

module.exports = router;