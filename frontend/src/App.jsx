import { BrowserRouter, Routes , Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/courses/:id" element={<CourseDetail/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
// What this does: BrowserRouter enables page-navigation-by-URL in your app. Routes holds all your possible pages. <Route path="/register" element={<Register />} /> says: "when the URL is /register, show the Register component."