const enrollementModel = require('../models/enrollmentSchema');
const courseModel = require('../models/Course');
const enrollStudent = async (req,res)=>{
    try{
        // step:1
        //student (from req.user._id) → who is enrolling
        const student = req.user._id;
        //courseId (from req.params) → which course they're enrolling in
        const {courseId} = req.params;

        //step:2
        //check the course is actually exist before enrolling
        const course = await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        };
        //step:3
        //before creating a new enrollment, first go check — "does an enrollment already exist for THIS student AND THIS course?"
        const existingEnrollment = await enrollementModel.findOne({
            student:student,
            course:courseId,
        });
        if(existingEnrollment){
            return res.status(409).json({
                message:"you are already enrolled to this course"
            })
        }
        const enrollment = await enrollementModel.create({
            student:student,
            course:courseId,
        })
        return res.status(201).json({
            enrollment,
            message:"student enrolled succesfully"
        })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {enrollStudent}

