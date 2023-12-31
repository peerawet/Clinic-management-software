import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import BranchPage from "./page/BranchPage";
import { useState, createContext, useEffect } from "react";
export const IsLoginContext = createContext();

function App() {
  const storedIsLogin = localStorage.getItem("isLogin"); // use browser storage to store the login state and retrieve it when the application refrech.
  const [isLogin, setIsLogin] = useState(storedIsLogin === "true");

  useEffect(() => {
    localStorage.setItem("isLogin", isLogin.toString());
    console.log(localStorage);
  }, [isLogin]);

  return (
    <IsLoginContext.Provider value={{ isLogin, setIsLogin }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isLogin ? <Navigate to="/branch" /> : <LoginPage />}
          />
          <Route
            path="/:id"
            element={isLogin ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/branch"
            element={isLogin ? <BranchPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </IsLoginContext.Provider>
  );
}

export default App;
