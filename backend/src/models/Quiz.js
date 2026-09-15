const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    lesson:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lessons",
        required:true
    },
    questions:[
        {
            questionText:{type:String,required:true},
            options:[String], //an array of strings-the possible answers
            correctAnswer:{type:String,required:true}
        }
    ]
},{timestamps:true});

const quizModel = mongoose.model("Quiz",QuizSchema);
module.exports = quizModel;