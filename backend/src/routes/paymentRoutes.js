const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const { paymentController } = require('../controllers/paymentController');

router.post('/courses/:courseId/create-order', protectMiddleware, paymentController);

module.exports = router;