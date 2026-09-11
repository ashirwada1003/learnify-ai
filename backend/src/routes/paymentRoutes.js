const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/authMiddleware');
const { paymentController } = require('../controllers/paymentController');
const {verifyPayment} = require('../controllers/verifyPayment');

router.post('/courses/:courseId/create-order', protectMiddleware, paymentController);
router.post('/courses/:courseId/verify-payment',protectMiddleware,verifyPayment);

module.exports = router;