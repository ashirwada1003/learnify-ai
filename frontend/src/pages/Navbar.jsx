import { Link, useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();

    // logout = throw away the saved token, then go to the login page
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return(
        <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-8 py-3 text-white backdrop-blur">
            <Link to="/dashboard" className="text-lg font-bold text-emerald-300">Learnify-AI</Link>

            <div className="flex items-center gap-6 text-sm">
                <Link to="/dashboard" className="hover:text-emerald-300">My Learning</Link>
                <Link to="/courses" className="hover:text-emerald-300">Courses</Link>
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-white/30 px-3 py-1 hover:bg-white/10"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;