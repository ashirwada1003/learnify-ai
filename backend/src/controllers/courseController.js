const courseModel = require("../models/Course");
const lessonModel = require("../models/Lesson");

const createCourse = async(req,res)=>{
    try{
        const{title,description,price,thumbnail}=req.body;

        //all fields are required
        if(!title || !description ){
            return res.status(400).json({
                message:"All fields are required"
            });
        };

        //create a course
        const course = await courseModel.create({
            title,
            description,
            instructor : req.user._id,   // ← from the logged-in user, not req.body,
            // req.user._id in protectMiddleware/createCourse = "who is currently logged in?" → a User id
            price,
            thumbnail,
        });
        return res.status(201).json({
            message:"course created succesfully",
            course:{
                _id:course._id,
                title:course.title,
                description:course.description,
                instructor:course.instructor,
                price:course.price,
                thumbnail:course.thumbnail,
            }
        });
    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    };
};


// We don't take instructor from the request body, because that would let someone claim any identity they want for the course — even someone else's. We use req.user._id instead, since that's the verified identity attached by protectMiddleware, and can't be faked.


//getAllcourses anyone can browse
const getAllCourses = async (req,res)=>{
    try{
        const courses = await courseModel.find();
        return res.status(200).json({
            courses
        })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
};

const getCourseById = async (req,res)=>{
    try{

        // This id comes from the URL itself — like GET /api/courses/xyz789. That xyz789 is a Course's _id, not a user's id at all
        const {id} = req.params;

        const course = await courseModel.findById(id);
        if(!course){
            return res.status(404).json({
                message:"Course Not found"
            });
        }

        const lessons = await lessonModel.find({course:id});
        return res.status(200).json({
            course,
            lessons
        });
    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
}

module.exports = {createCourse,getAllCourses,getCourseById};