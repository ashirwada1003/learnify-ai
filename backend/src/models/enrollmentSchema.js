const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
    },
    completedLessons:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Lessons"
            }
        ]
},{timestamps:true});

const enrollmentModel = mongoose.model("Enrollments",enrollmentSchema);

module.exports= enrollmentModel;