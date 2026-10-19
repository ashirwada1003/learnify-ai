import { useEffect } from "react";
import {Link } from "react-router-dom";
import API from "../services/api";
import { useState } from "react";

function Dashboard(){
    //enrollments holds the list from the backend. It starts as an empty array [] because nothing has loaded yet.
    const[enrollments,setEnrollments]=useState([]);
    //loading is true at first, because we are waiting for the backend. We’ll show “Loading...” while it’s true.
    const[loading,setLoading]=useState(true);
    // error holds an error message if the fetch fails. It starts empty.
    const[error,setError]=useState("");

    useEffect(()=>{
        const fetchEnrollments = async()=>{
            try{
                const res = await API.get("/my-enrollments");
                setEnrollments(res.data.enrollments);
            }catch(err){
                setError(err.response?.data?.message || "Could not load your courses.");
            }finally{
                setLoading(false);
            }
        };
        fetchEnrollments();
    },[])

    if(loading) return <div className="page-wrap">Loading...</div>


    return(
        <div className="page-wrap">
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>

            {/* error message, only there is one */}
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

            {/* empty state : no error no enrollments */}
            {!error && enrollments.length === 0 && (
                <div>
                    <p className="text-slate-300">you haven't enrolled in any of the course yet.</p>
                    <Link to="/courses" className="btn-hero mt-4 inline-block">
                      Browse courses 
                     </Link>
                </div>
            )}

            {/* one card per enrolled course */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrollments.map((e)=>(
                <Link key={e._id} to={`/courses/${e.course._id}`} className="course-card">
                    <h3 className="font-bold text-lg">{e.course.title}</h3>
                    <p className="text-slate-300 text-sm">{e.course.description}</p>
                </Link>
                ))}
            </div>
        </div>
    )
}
export default Dashboard