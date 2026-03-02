import { Routes, Route  } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Showmenu from "./pages/Showmenu";
import MenuManager from "./pages/MenuManager";
import AddMenu from "./pages/Addmenu";
import Showemployee from "./pages/Showemployee"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/showmenu" element={<Showmenu/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/menu" element={<MenuManager/>} />
      <Route path="/addmenu" element={<AddMenu/>} />
      <Route path="/employee" element={<Showemployee/>} />
      
    </Routes>
  );
}

export default App;
