import React from "react";
import LoginForm from "./components/loginForm";



function App() {
  const handleLoginSuccess = (user) => {
    console.log("Login successful", user);
  }
  return <LoginForm onLoginSuccess={handleLoginSuccess}/>
}

export default App;
