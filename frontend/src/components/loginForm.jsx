import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/loginform.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev=>({...prev, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if(data.userResponse) {
        localStorage.setItem("user", JSON.stringify(data.userResponse));
      }

      setSuccessMsg(data.message || "Đăng nhập thành công")
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-box">{error}</div>}
      {successMsg && <div className="success-box">{successMsg}</div>}
      <form action="" onSubmit={handleSubmit} className="login-form">
        <h2>Longin</h2>
        <label htmlFor="username">Username or Email:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          autoComplete="username"
          onChange={handleChange}
          placeholder="Enter your username or email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="switch-auth">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
}
