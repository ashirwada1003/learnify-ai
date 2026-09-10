const razorpayInstance = require('../config/razorpay');
const courseModel = require('../models/Course');

const paymentController = async(req,res)=>{
    try{
        const {courseId} = req.params;

        //fetch courses
        const course = await courseModel.findById(courseId);
        //check if it exist
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
         // before doing anything about payment
         if(course.price === 0){
            return res.status(400).json({
                message:"This course is free. please use direct enroll endpoint"
            })
         }
         
         const options = {
            amount : course.price * 100,
            currency : "INR",
            receipt : `receipt_${courseId}`
         };
         const order = await razorpayInstance.orders.create(options);
         return res.status(200).json({
            message:"Order created succesfully",
            order
         })
    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    };
}

module.exports = {paymentController};