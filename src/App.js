import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/auth/Login";
import ErrPage from "./components/ErrPage";
import './App.css'

function App() {

  const [token, setToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    setToken(token);
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<ErrPage />}
        />
      </Routes>
    </BrowserRouter>
    // !token ? <Login /> : <Home />
  );
}

export default App;
