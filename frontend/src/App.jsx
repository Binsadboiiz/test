import React from "react";
import LoginForm from "./components/loginForm";



function App() {
  const handleLoginSuccess = (user) => {
    alert("Login successful", user);
  }
  return <LoginForm onLoginSuccess={handleLoginSuccess}/>
}

export default App;
