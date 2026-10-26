const lessonModel = require('../models/Lesson');
const courseModel = require('../models/Course');
const quizModel = require('../models/Quiz');
const enrollmentModel = require('../models/enrollmentSchema');
const { generateQuiz } = require('../services/ai.service');
const { sendCourseNotification } = require('../services/notification.service');

const generateQuizController = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { numQuestions } = req.body; // optional — if not provided, defaults to 5 inside generateQuiz

        // Step 1: fetch the lesson, confirm it exists
        const lesson = await lessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Step 2: fetch the lesson's PARENT COURSE — needed for the ownership check,
        // AND we reuse this same "course" variable below for the notification
        const course = await courseModel.findById(lesson.course);
        if (!course) {
            return res.status(404).json({ message: "Parent course not found" });
        }

        // Step 3: confirm the logged-in instructor actually owns this course
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to generate a quiz for this lesson" });
        }

        // Step 4: call the AI service
        const questions = numQuestions
            ? await generateQuiz(lesson.content, numQuestions)
            : await generateQuiz(lesson.content);

        // Step 5: save the generated questions as a new Quiz document
        const quiz = await quizModel.create({
            lesson: lessonId,
            questions
        });

        // Step 6: notify — notice we use "course._id" here, the SAME course document
        // we already fetched above for the ownership check. No need to fetch it again.
        const io = req.app.get('io');
        sendCourseNotification(io, course._id, `A new quiz is available for lesson: "${lesson.title}"`);

        // Step 7: return the created quiz
        return res.status(201).json({
            message: "Quiz generated successfully",
            quiz
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Student: get the latest quiz for a lesson, WITHOUT the correct answers
const getQuizController = async (req, res) => {
    try {
        const { lessonId } = req.params;

        const lesson = await lessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // only enrolled students may take the quiz
        const enrollment = await enrollmentModel.findOne({
            student: req.user._id,
            course: lesson.course
        });
        if (!enrollment) {
            return res.status(403).json({ message: "Enroll in this course to take the quiz" });
        }

        // newest quiz first (an instructor can generate more than one)
        const quiz = await quizModel.findOne({ lesson: lessonId }).sort({ createdAt: -1 });
        if (!quiz) {
            return res.status(404).json({ message: "No quiz is available for this lesson yet" });
        }

        // send only what the student needs: no correctAnswer
        const questions = quiz.questions.map((q) => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options
        }));

        return res.status(200).json({
            quizId: quiz._id,
            lessonTitle: lesson.title,
            questions
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Student: send answers, the SERVER checks them and returns the score
const submitQuizController = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { quizId, answers } = req.body; // answers looks like { questionId: "chosen option text" }

        if (!quizId || !answers) {
            return res.status(400).json({ message: "quizId and answers are required" });
        }

        const lesson = await lessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const enrollment = await enrollmentModel.findOne({
            student: req.user._id,
            course: lesson.course
        });
        if (!enrollment) {
            return res.status(403).json({ message: "Enroll in this course to take the quiz" });
        }

        const quiz = await quizModel.findById(quizId);
        if (!quiz || quiz.lesson.toString() !== lessonId) {
            return res.status(404).json({ message: "Quiz not found for this lesson" });
        }

        let score = 0;
        const results = quiz.questions.map((q) => {
            const selected = answers[q._id.toString()] || null;
            const correct = selected !== null && selected.trim() === q.correctAnswer.trim();
            if (correct) score++;
            return {
                questionId: q._id,
                questionText: q.questionText,
                selected,
                correctAnswer: q.correctAnswer,
                correct
            };
        });

        return res.status(200).json({
            score,
            total: quiz.questions.length,
            results
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { generateQuizController, getQuizController, submitQuizController };
