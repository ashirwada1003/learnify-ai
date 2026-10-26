import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function Quiz(){
    const { lessonId } = useParams();

    const[quiz,setQuiz]=useState(null);        // quizId, lessonTitle, questions
    const[answers,setAnswers]=useState({});    // { questionId: chosen option }
    const[result,setResult]=useState(null);    // score and per-question results
    const[loading,setLoading]=useState(true);
    const[submitting,setSubmitting]=useState(false);
    const[error,setError]=useState("");

    useEffect(()=>{
        const fetchQuiz = async () => {
            try{
                const res = await API.get(`/lessons/${lessonId}/quiz`);
                setQuiz(res.data);
            }catch(err){
                setError(err.response?.data?.message || "Could not load the quiz.");
            }finally{
                setLoading(false);
            }
        };
        fetchQuiz();
    },[lessonId]);

    // remember which option the student picked for a question
    const handleSelect = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        try{
            const res = await API.post(`/lessons/${lessonId}/quiz/submit`, {
                quizId: quiz.quizId,
                answers
            });
            setResult(res.data);
        }catch(err){
            setError(err.response?.data?.message || "Could not submit the quiz.");
        }finally{
            setSubmitting(false);
        }
    };

    if(loading) return <div className="page-wrap">Loading quiz...</div>;

    // true only when every question has an answer
    const allAnswered = quiz && quiz.questions.every((q)=> answers[q._id]);

    return(
        <div className="page-wrap">
            <div className="mx-auto max-w-3xl">
                <Link to="/dashboard" className="text-sm text-slate-300 underline hover:text-white">← Back to My Learning</Link>

                {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

                {quiz && !result && (
                    <>
                        <h1 className="mt-4 text-2xl font-bold">Quiz: {quiz.lessonTitle}</h1>

                        {quiz.questions.map((q, index)=>(
                            <div key={q._id} className="mt-6 rounded-lg border border-white/10 bg-white/10 p-4">
                                <p className="font-semibold">{index + 1}. {q.questionText}</p>
                                <div className="mt-3 space-y-2">
                                    {q.options.map((option)=>(
                                        <label key={option} className="flex cursor-pointer items-center gap-2 text-slate-200">
                                            <input
                                             type="radio"
                                             name={q._id}
                                             checked={answers[q._id] === option}
                                             onChange={()=>handleSelect(q._id, option)}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                         onClick={handleSubmit}
                         disabled={!allAnswered || submitting}
                         className="mt-6 rounded-lg bg-emerald-500 px-5 py-2 font-semibold hover:bg-emerald-400 disabled:bg-gray-500"
                        >
                            {submitting ? "Submitting..." : "Submit quiz"}
                        </button>
                    </>
                )}

                {result && (
                    <>
                        <h1 className="mt-4 text-2xl font-bold">Your score: {result.score} / {result.total}</h1>

                        {result.results.map((r, index)=>(
                            <div
                             key={r.questionId}
                             className={`mt-4 rounded-lg border p-4 ${r.correct ? "border-emerald-300/40 bg-emerald-400/10" : "border-red-300/40 bg-red-400/10"}`}
                            >
                                <p className="font-semibold">{index + 1}. {r.questionText}</p>
                                <p className="mt-2 text-sm">Your answer: {r.selected || "not answered"}</p>
                                {!r.correct && (
                                    <p className="text-sm text-emerald-200">Correct answer: {r.correctAnswer}</p>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;