import { Routes, Route } from "react-router-dom";
import React from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";



function App() {
  return (
      <Routes>
        <Route path='/' element={<LoginForm/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/login' element={<LoginForm/>}/>
      </Routes>
  )
}

export default App;
