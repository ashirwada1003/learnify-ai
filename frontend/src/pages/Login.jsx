import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login(){
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[error,setError]=useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const res = await API.post("/auth/login",{email,password});
            localStorage.setItem("token",res.data.token);

            navigate('/dashboard')
        }catch(err){
            setError(err.response?.data?.message || "login failed")
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input 
                     type="email"
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
                        Login
                    </button>

                </form>
                {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>

        </div>
    )
}
export default Login;