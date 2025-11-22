import { Routes, Route } from "react-router-dom";
import React from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import HomePage from "./pages/home";
import AdminDashboard from "./pages/adminDashboard";

import UserManagemnet from "./components/userManagement";
import MainLayout from "./layout/mainlayout";

function App() {
  return (
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path='/' element={<HomePage/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='admin/users' element={<UserManagemnet/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          <Route path='/login' element={<LoginForm/>}/>
        </Route>
      </Routes>
  )
}

export default App;
