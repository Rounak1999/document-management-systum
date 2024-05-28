import { useEffect, useState } from "react";
import Home from "./pages/main/Home";
import Login from "./pages/auth/Login";
// import ErrPage from "./components/ErrPage";
import './App.css'

function App() {

  const [token, setToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    setToken(token);
  }, [])

  return (
    !token ? <Login /> : <Home />
  );
}

export default App;
