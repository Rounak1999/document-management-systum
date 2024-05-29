import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/auth/Login";
import ErrPage from "./components/ErrPage";
import './App.css'
import UploadDocument from "./pages/main/UploadDocument";
import SearchDocument from "./pages/main/SearchDocument";

function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("token");
    setToken(token);
  }, [])

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload_document" element={<UploadDocument />} />
        <Route path="/search_document" element={<SearchDocument />} />
        <Route path="*" element={token === "" && token === undefined && token === null ? <Navigate to="/" replace={true} /> : <Navigate to="/home" replace={true} />} />
      </Routes>

    </BrowserRouter>
    // !token ? <Login /> : <Home />
  );
}

export default App;
