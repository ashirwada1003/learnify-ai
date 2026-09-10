const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const lessonRoutes = require('./src/routes/lessonRoute');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

//middlewares for parsing request bodies
app.use(express.json());
//middleware for frontend to talk with backend
app.use(cors());
//routes auth
app.use('/api/auth',authRoutes);
//routes for course
app.use('/api',courseRoutes);
//routes for lesson
app.use('/api',lessonRoutes);
//routes for enrollment of student
app.use('/api',enrollmentRoutes);
//routes for payment
app.use('/api', paymentRoutes);

module.exports = app;