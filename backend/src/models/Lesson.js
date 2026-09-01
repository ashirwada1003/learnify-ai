const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
    },
    order:{
        type:Number
    }
},{timestamps:true});

const lessonModel = mongoose.model("Lessons",lessonSchema);

module.exports = lessonModel;