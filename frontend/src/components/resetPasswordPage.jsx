import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/auth.css";

const API_BASE = "http://localhost:3000/api/users";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  console.log("ResetPassword token, email = ", token, email); // debug

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Password confirmation does not match.");
      return;
    }

    try {
      setMessage("");
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      if (!res.ok) throw res;

      const data = await res.json();
      setMessage(data.message || "Password has been reset.");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      HandleErrorAPI(error, navigate, "ResetPasswordPage.handleSubmit");
    }
  };

  if (!token || !email) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>Reset Password</h1>
          <p style={{color: "black"}}>Invalid reset link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <label>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm new password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit">Update password</button>
        </form>
        {message && <p style={{ marginTop: 8 }}>{message}</p>}
      </div>
    </div>
  );
}
