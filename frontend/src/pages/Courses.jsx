import { useState,useEffect } from "react";
import API from "../services/api";

function Courses(){
    // this will hold the actual list of courses once we fetch them — starts empty
    const[courses,setCourses]=useState([]);

    
    // the function inside here runs ONCE, right when this page first loads —
    // NOT every time the component re-renders (which is what would happen
    // if we just called the API directly in the function body, like you correctly guessed)
    useEffect(()=>{
        const fetchCourses = async () =>{
            const res = await API.get("/courses");
            setCourses(res.data.courses);
        };
        fetchCourses();
    },[]) // <-- this empty array is what tells React "only run this once"


    return(
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Courses</h1>
             {/* courses.map(...) goes through EVERY course in our array, one at a time,and turns each one into a piece of JSX (here, just a list item) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course)=>(
                    <div key={course._id} className="border rounded-lg p-4 shadow">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.description}</p>
                        {/* <p className="text-green-600 font-semibold">{course.price}</p> */}
                        {course.price === 0 ?(
                            <p className="text-green-600 font-semibold">Free</p>
                        ):(
                            <p className="text-green-600 font-semibold">₹{course.price}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Courses

// The part you were missing context for, now explained in place: that [] at the very end of useEffect(() => {...}, []) is called the dependency array. An empty array specifically means "there's nothing this effect depends on, so only run it once, when the page first mounts." (Later, you might see non-empty dependency arrays, meaning "re-run this whenever X changes" — but for "fetch data once on page load," empty is exactly right.)

// The one genuinely new thing here: key={course._id}. Whenever you render a list of items in React using .map(), React needs a way to tell each item apart — especially if the list ever changes (items added/removed/reordered). We use course._id since it's guaranteed unique for every course (remember, MongoDB gives every document its own unique _id).

// Breaking this down: condition ? <A> : <B> is JavaScript's ternary operator — a compact way of writing "if this is true, show A; otherwise, show B," all in one expression (since JSX doesn't let you write a full if/else statement directly inside curly braces — a ternary is the standard workaround). Here: "if the price is exactly 0, show 'Free'; otherwise, show the rupee symbol plus the actual price."