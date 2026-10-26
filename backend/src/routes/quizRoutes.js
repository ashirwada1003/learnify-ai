const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { generateQuizController, getQuizController, submitQuizController } = require('../controllers/quizController');

// student takes the quiz
router.get('/lessons/:lessonId/quiz', protectMiddleware, authorizeRoles('student'), getQuizController);
router.post('/lessons/:lessonId/quiz/submit', protectMiddleware, authorizeRoles('student'), submitQuizController);

module.exports = router;