import { useState } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";

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
        <div className="page-bg">

            {/* decorative glow blobs, same as Home */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/30 blur-3xl"></div>

            <div className="glass-card">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="mt-1 mb-6 text-sm text-slate-300">Login to continue learning</p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input 
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e)=>setEmail(e.target.value)}
                     className="input-field"
                    />

                    <input
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e)=>setPassword(e.target.value)}
                     className="input-field"
                    />

                    <button type="submit" className="btn-primary">
                        Login
                    </button>

                </form>
                {error && <p className="mt-3 text-sm text-red-300 ">{error}</p>}

                <p className="mt-6 text-center text-sm text-slate-300">
                    New here?{" "}
                    <Link to="/register" className="font-semibold text-emerald-300 underline">Create an account</Link>
                </p>
                <p className="mt-2 text-center text-sm">
                 <Link to="/" className="text-slate-400 hover:text-white">← Back to home</Link>
                </p>
            </div>

        </div>
    )
}
export default Login;