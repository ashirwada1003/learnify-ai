import { BrowserRouter, Routes , Route } from "react-router-dom";
import Home from "./pages/Home"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        {/* public pages : anyone can open these */}
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        {/* protected pages : only with token, and they get the navbar             */}
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/courses/:id" element={<CourseDetail/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
// What this does: BrowserRouter enables page-navigation-by-URL in your app. Routes holds all your possible pages. <Route path="/register" element={<Register />} /> says: "when the URL is /register, show the Register component."