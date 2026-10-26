import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CourseDetail(){
    const { id } = useParams();

    // the course and its lessons, once fetched
    const[course,setCourse]=useState(null);
    const[lessons,setLessons]=useState([]);

    // AI tutor box
    const[question,setQuestion]=useState("");
    const[answer,setAnswer] = useState("");
    const[sourceLesson,setSourceLesson] = useState("");
    const[asking,setAsking]=useState(false);

    // enrollment
    const[enrolled,setEnrolled] = useState(false);
    const[enrollMessage,setEnrollMessage] = useState("");
    // true while we are still asking the backend "am I already enrolled?"
    const[checkingEnrollment,setCheckingEnrollment] = useState(true);

    // fetch THIS course; runs again if the id in the URL changes
    useEffect(()=>{
        const fetchCourseDetail = async () =>{
            const res = await API.get(`/courses/${id}`);
            setCourse(res.data.course);
            setLessons(res.data.lessons);
        };
        fetchCourseDetail();
    },[id]);

    // check whether the logged-in student is already enrolled in this course
    useEffect(()=>{
        const checkEnrollment = async () => {
            try{
                const res = await API.get("/my-enrollments");
                const alreadyEnrolled = res.data.enrollments.some((e)=> e.course._id === id);
                setEnrolled(alreadyEnrolled);
            }catch(err){
                // not critical, so we stay silent
            }finally{
                // the check is over, whether it worked or failed
                setCheckingEnrollment(false);
            }
        };
        checkEnrollment();
    },[id]);

    // runs when the student submits a question
    const handleAskTutor = async (e)=>{
        e.preventDefault();

        if(!question.trim()) return;

        setAsking(true);

        try{
            const res = await API.post(`/courses/${id}/ask-tutor`,{question});
            setAnswer(res.data.answer);
            setSourceLesson(res.data.sourceLesson);
        }catch(err){
            setAnswer(err.response?.data?.message || "Something went wrong asking the tutor.");
            setSourceLesson("");
        }finally{
            setAsking(false);
        }
    };

    // runs when the student clicks Enroll
    const handleEnroll = async() =>{
        setEnrollMessage(""); // clear any old message first
        try{
            const res = await API.post(`/courses/${id}/enroll`);
            setEnrolled(true);
            setEnrollMessage(res.data.message);
        }catch(err){
            setEnrollMessage(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleBuy = async () =>{
        setEnrollMessage("");
        try{
            //1.ask your backened to create the order (the "bill")
            const orderRes = await API.post(`/courses/${id}/create-order`);
            const order = orderRes.data.order;
 
            //2.settings for razrorpay popup  
            const options = {
                key : import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount : order.amount,
                currency: order.currency,
                name:"Learnify-AI",
                description:course.title,
                order_id:order.id,
                //3.runs only after the payment succeeds inside the popup
                handler:async(response)=>{
                    try{
                        const verifyRes = await API.post(`/courses/${id}/verify-payment`,{
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        });
                        setEnrolled(true);
                        setEnrollMessage(verifyRes.data.message);
                    }catch(err){
                        setEnrollMessage(err.response?.data?.message || "payment verification failed ")
                    }
                },
                theme:{color:"#10b981"},
            };

            //4. open the popup
            const rzp = new window.Razorpay(options);

            rzp.open();
        }catch(err){
            setEnrollMessage(err.response?.data?.message || "Could not start payment")
        }
    };

    return(
        <div className="page-wrap">
            {course && (
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-slate-300">{course.description}</p>

                    {/* show the button only when we have finished checking AND the student is not enrolled */}
                    {!checkingEnrollment && !enrolled && course.price === 0 &&(
                        <button
                         type="button"
                         onClick={handleEnroll}
                         className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400"
                        >
                            Enroll now
                        </button>
                    )}

                    {!checkingEnrollment && !enrolled && course.price > 0 &&(
                        <button 
                         type="button"
                         onClick={handleBuy}
                         className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400">
                            Buy for ₹{course.price}
                        </button>
                    )}

                    {/* the backend's message (success, already enrolled, paid course, etc.) */}
                    {enrollMessage && (
                        <p className="mt-2 text-sm text-emerald-200">{enrollMessage}</p>
                    )}

                    <h2 className="text-xl font-semibold mt-6 mb-3">Lessons</h2>
                    <ul className="space-y-2">
                        {lessons.map((lesson)=>(
                            <li key={lesson._id} className="rounded-lg border border-white/10 bg-white/10 p-3">{lesson.title}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Ask the AI Tutor</h2>

                    <form onSubmit={handleAskTutor} className="flex gap-2">
                        <input
                         type="text"
                         placeholder="Ask a question about this course..."
                         value={question}
                         onChange={(e)=>setQuestion(e.target.value)}
                         className="input-field"
                        />

                        <button
                          type="submit"
                          disabled={asking}
                          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400 disabled:bg-gray-500"
                        >
                            {asking ? "Asking..." : "Ask"}
                        </button>
                    </form>

                    {answer && (
                        <div className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 p-4 mb-6">
                            <p className="text-white">{answer}</p>
                            {sourceLesson && (
                                <p className="text-slate-300 text-sm mt-2">Source: {sourceLesson}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CourseDetail;

// Something genuinely new to notice: [id] instead of [] in the dependency array. Remember, [] meant "run once, ever." [id] means: "run this effect once initially, AND again any time id changes." Why does that matter here specifically? Think about it — if a student is on this page viewing one course, then clicks a link to a different course, the URL's id changes, but the component doesn't necessarily get destroyed and recreated — so without [id] in the dependency array, it might keep showing the old course's data even though the URL changed.

// {course && (...)} — same && trick we used for the error message earlier, but now for a whole block. Since course starts as null (before the fetch finishes), trying to render course.title immediately would crash with an error like "cannot read property of null." This check says: "only try to render this block if course actually has data in it."

{/* <>...</> — this is called a React Fragment. Normally, JSX requires everything to be wrapped in ONE parent tag. But we have two separate elements (<h1> and <p>) that we want to render together, without adding an unnecessary extra <div> just to satisfy that rule. A Fragment (<>...</>) acts as an invisible wrapper — it groups elements together for React's sake, without actually adding any extra HTML to the page. */}

// Why each one exists: question is a controlled input, same pattern as your Login/Register forms. answer and sourceLesson store what comes back from your askTutor endpoint. asking is new — a loading flag — since calling an LLM takes a few seconds (you saw this yourself in Postman), and without some loading indicator, the page would just look frozen/broken while waiting.

// One genuinely new thing here: finally. You've used try/catch many times now — finally is a third, optional block that runs no matter what — whether the try succeeded or the catch caught an error. It's perfect for cleanup actions like "stop showing the loading spinner," since you want that to happen either way, not just on success.
// Also notice: this reuses id from useParams(), which you already have from fetching the course — same course id, just used for a different endpoint now (/ask-tutor instead of /courses/:id)

// disabled={asking} — while asking is true (we're waiting for the AI), the button becomes unclickable. This prevents the student from spamming the "Ask" button multiple times while a request is already in flight, which could otherwise fire off several duplicate AI calls at once (wasteful, and confusing).
// {asking ? "Asking..." : "Ask"} — same ternary pattern as your Free/₹price display earlier, just applied to button text this time: show "Asking..." while loading, "Ask" otherwise. This is what actually gives the student visible feedback that something is happening, instead of the page looking frozen.