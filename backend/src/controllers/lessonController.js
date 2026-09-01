const lessonModel = require('../models/Lesson');
const courseModel = require('../models/Course');

const createLesson = async(req,res)=>{
    try{

        const{courseId} = req.params; // e.g. POST /api/courses/:courseId/lessons

        const{title,content,videoUrl,order} = req.body;

        if(!title || !content){
            return res.status(400).json({
                message:"Title and content are required!"
            });
        }

        //does this course exist?
        const course = await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        };

        //does the logged-in user actually own this course
        if(course.instructor.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"You are not allowed to add lessons to this course"
            });
        };

        //safe to create lesson now
        const lesson = await lessonModel.create({
            course:courseId,
            title,
            content,
            videoUrl,
            order
        });
        return res.status(201).json({
            message:"Lesson created succesfully",
            lesson
        });
    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    };
};

module.exports = {createLesson};