// backend/src/services/notification.service.js

// This function sends a real-time notification to a specific "room" (a course)
// Anyone whose frontend has "joined" that course's room will receive it instantly
const sendCourseNotification = (io, courseId, message) => {
    io.to(courseId.toString()).emit('notification', {
        message,
        timestamp: new Date()
    });
};

module.exports = { sendCourseNotification };