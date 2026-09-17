import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import API from "../services/api"
function CourseDetail(){
    const { id } = useParams();

    //will hold the course + its lessons once fetched
    const[course,setCourse]=useState(null);
    const[lessons,setLessons]=useState([]);

    // what the student is currently typing into the question box
    const[question,setQuestion]=useState("");

    // the AI's most recent answer, once we get one back
    const[answer,setAnswer] = useState("");

    // which lesson the answer came from (remember, askTutor returns this too)
    const[sourceLesson,setSourceLesson] = useState("");

    // tracks whether we're waiting on the AI's response, so we can show a loading state
    const[asking,setAsking]=useState(false)

    useEffect(()=>{
        const fetchCourseDetail = async () =>{
            // notice: we use the "id" from the URL here, to fetch THIS specific course
            const res = await API.get(`/courses/${id}`);
            setCourse(res.data.course);
            setLessons(res.data.lessons);
        };

        fetchCourseDetail();
    },[id]); // <-- notice this is NOT an empty array this time


    //this runs when the student submits their question
    const handleAskTutor = async (e)=>{
        e.preventDefault();

        if(!question.trim()) return; //becz dont send an empty question

        setAsking(true); //show loading state while we wait for the AI

        try{
            const res = await API.post(`/courses/${id}/ask-tutor`,{question});
            setAnswer(res.data.answer);
            setSourceLesson(res.data.sourceLesson);
        }catch(err){
            setAnswer(err.response?.data?.message || "Something went wrong asking the tutor.");
            setSourceLesson("");
        }finally{
            setAsking(false); //stop loading,whether it succeeded or failed
        }
    };
    return(
        <div className="p-8">
            {/* course might still be null on the very first render, before the fetch completes —
            this check stops us from crashing trying to read .title off of null */}
            {course && (
                <>
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-gray-600 mt-2">{course.description}</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Lessons</h2>
                    <ul className="space-y-2">
                        {lessons.map((lesson)=>(
                            <li key={lesson._id} className="border rounded p-3">{lesson.title}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">Ask the AI Tutor</h2>


                    <form onSubmit={handleAskTutor}>

                        <input 
                         type="text"
                         placeholder="Ask a question about this course..."
                         value={question}
                         onChange={(e)=>setQuestion(e.target.value)}
                         className="flex-1 border border-gray-300 rounded px-3 py-2"
                        />

                        <button 
                          type="submit"
                          disabled={asking}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {asking ? "Asking..." : "ASk"}
                        </button>
                    </form>

                    {answer && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                            <p className="text-gray-800">{answer}</p>
                            {sourceLesson && (
                                <p className="text-sm text-gray-500 mt-2">Source: {sourceLesson}</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
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