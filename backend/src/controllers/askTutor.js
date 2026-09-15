const enrollmentModel = require('../models/enrollmentSchema');
const lessonModel = require('../models/Lesson');
const{generateEmbedding,cosineSimilarity,generateAnswer} = require('../services/ai.service');

const askTutor = async(req,res)=>{
    try{
        const{courseId} = req.params;
        const{question} = req.body;

        if(!question){
            return res.status(400).json({
                message:"Question is required"
            });
        }
        // Check the student is actually enrolled in this course
        // (hint: same findOne pattern from enrollStudent, checking student: req.user._id, course: courseId)
        const existingEnrollment = await enrollmentModel.findOne({
            student:req.user._id,
            course:courseId,
        });
        if(!existingEnrollment){
            return res.status(403).json({
                message:"You must be enrolled in this course to use the AI tutor"
            })
        }
        //step1:convert the student's question into its own emeding
        const questionEmbedding = await generateEmbedding(question);

        //step2:get all the lessons in this course, so we can compare each one
        const lessons = await lessonModel.find({course:courseId});

        if(lessons.length === 0){
            return res.status(404).json({
                message:"No lessons found in this course yet"
            })
        }

        //step:3 find the lesson with the highest similarity to the question
        let bestLesson = null;
        let bestScore = -1; // cosine similarity ranges from -1 to 1, so start lower than any possible score

        for(const lesson of lessons){
            const score = cosineSimilarity(questionEmbedding,lesson.embedding);

            // // if this lesson's score is better than the best one seen so far, update our tracker
            if(score > bestScore){
                bestScore = score;
                bestLesson = lesson;
            }
        }

        //step:4 ask the AI to generate an answer, using ONLY the best-matched lesson's content
        const answer = await generateAnswer(question,bestLesson.content);

        //step:5 send everything back to student
        return res.status(200).json({
            question,
            answer,
            sourceLesson:bestLesson.title, // so the student can see WHICH lesson this came from
        })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {askTutor};