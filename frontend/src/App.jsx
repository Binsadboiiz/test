import { Routes, Route } from "react-router-dom";
import React from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import HomePage from "./pages/home";
import MainLayout from "./layout/mainlayout";
import BookList from "./pages/bookList";
import ErrorPage from "./components/ErrorPage";



function App() {
  return (
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path='/' element={<HomePage/>}/>
          <Route path='book' element={<BookList/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          <Route path='/login' element={<LoginForm/>}/>
        </Route>
        <Route path='/error' element={<ErrorPage/>} />
      </Routes>
  )
}

export default App;
