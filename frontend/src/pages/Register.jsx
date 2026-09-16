// This page lets a new user create an account.
// Remember: our backend ALWAYS creates new accounts as "student" by default
// (role can never be chosen at registration — that's a deliberate security choice
// we made on the backend, so nobody can register themselves as an instructor/admin).

// useState: lets this component "remember" values (like what the user typed) and re-render when they change
import { useState } from "react";

// useNavigate: lets us redirect the user to a different page after an action (like after registering)
// Link: lets us create a clickable link to another page, without a full page reload
import { useNavigate } from "react-router-dom";

//our assistant file - handles taking to the backend
import API from "../services/api";

function Register(){
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const[error,setError]=useState("");

    const navigate = useNavigate();

    //this function runs when the form is submitted
    const handleSubmit = async (e)=>{
        //stops the browser's default behavior of reloading the whole page on form submission
        e.preventDefault();

        try{
            //send name,email,password to our backend's register route
            await API.post("/auth/register",{name,email,password});

            //if it succeds send user to the login page
            navigate("/login");
        }catch(err){
            //if the backend send an error like("email already exist"),show it..
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return(
        // flex + items-center + justify-center = center everything on the screen, both directions
        // min-h-screen = take up the full height of the browser window
        // bg-gray-100 = light gray background for the whole page
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

              {/* the actual white card that holds the form */}
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Register</h2>

                {/* onSubmit={handleSubmit} means: when this form is submitted, run our handleSubmit function */}
                <form onSubmit={handleSubmit} className="space-y-4">
                     {/* space-y-4 automatically adds vertical spacing between each child element inside the form */}

                    <input 
                     type="text"
                     placeholder="Name"
                     value={name}
                     onChange={(e)=>setName(e.target.value)}
                     className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    
                    <input
                     type="text"
                     placeholder="Email"
                     value={email}
                     onChange={(e)=>setEmail(e.target.value)}
                     className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <input 
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e)=>setPassword(e.target.value)}
                     className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Register
                    </button>
                </form>
                {/* only show this paragraph IF there's an error message stored */}
                {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>
        </div>
    )
}

export default Register;
// useState("") gives you back two things — the current value (name), and a function to change that value (setName). Whenever you call setName(...), React automatically re-renders the component with the new value.

// useState: value={name} means this input always displays whatever's currently stored in name. onChange={(e) => setName(e.target.value)} means every time you type a character, it immediately updates name via setName. This two-way connection (value + onChange) is called a "controlled input" — the input's displayed value is fully controlled by React state, not by the browser itself

// Why type="submit" matters: this is what connects the button to the form's onSubmit={handleSubmit} — clicking a type="submit" button inside a <form> automatically triggers that form's submit handler. If you left off type="submit" (or used type="button" by mistake), clicking it would do nothing.