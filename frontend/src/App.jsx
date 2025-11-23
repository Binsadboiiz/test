import { Routes, Route } from "react-router-dom";
import React from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import HomePage from "./pages/home";
import AdminDashboard from "./pages/adminDashboard";

import EditUser from "./components/editUser";
import MainLayout from "./layout/mainlayout";
import BookList from "./pages/bookList";
import ErrorPage from "./components/ErrorPage";
import ThreadList from "./pages/threadList";
import CreateThread from "./pages/createThread";
import ThreadDetail from "./components/threadDetail";


function App() {
  return (
      <Routes>
        <Route element={<MainLayout/>} >
          <Route path='/' element={<HomePage/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/users/edit/:userId' element={<EditUser/>}/>
          <Route path='/books' element={<BookList/>}/>
          <Route path='forum' element={<ThreadList />}></Route>
          <Route path='/forum/threads/new' element={<CreateThread />}></Route>
          <Route path='/forum/threads/:id' element={<ThreadDetail />}></Route>
        </Route>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/error' element={<ErrorPage/>} />
      </Routes>
  )
}

export default App;
