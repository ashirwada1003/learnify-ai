const crypto = require('crypto');

const verifyPayment = async (req, res) => {
    try {
        const { courseId } = req.params;
        // destructure the three razorpay_ fields from req.body
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

        const generatedSignature = crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

        if(generatedSignature !== razorpay_signature){
            return res.status(400).json({
                message:"Payment verification failed!"
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};