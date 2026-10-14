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

    if(loading) return <div className="p-8">Loading...</div>


    return(
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Courses</h1>

            {enrollments.map((e)=>(
                <div key={e._id} className="border rounded p-3 mb-2">
                    <Link to={`/courses/${e.course._id}`}>{e.course.title}</Link>
                </div>
            ))}
        </div>
    )
}
export default Dashboard