import { BrowserRouter, Routes , Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
// What this does: BrowserRouter enables page-navigation-by-URL in your app. Routes holds all your possible pages. <Route path="/register" element={<Register />} /> says: "when the URL is /register, show the Register component."