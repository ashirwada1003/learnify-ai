import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Guard for pages that need a login.
// No token  -> send the visitor to /login.
// Has token -> show the navbar, then the page that matches the URL.
function ProtectedRoute(){
    const token = localStorage.getItem("token");

    if(!token){
        return <Navigate to="/login" replace />;
    }

    return(
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default ProtectedRoute;