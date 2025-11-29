import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/auth.css";

const API_URL = import.meta.env.API_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage("");
            
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email})
            });

            if(!res.ok) throw res;

            const data = await res.json();
            setMessage((data.message && alert("Please, check your email!"))|| "Please check your email");
        } catch (error) {
            HandleErrorAPI(error, navigate, "ForgotPassword.handleSubmit");
        }
    };

    return (
  <div className="auth-page">
    <div className="auth-form">
      <h1>Forgot Password</h1>
      <p className="subtitle">
        Nhập email để nhận link đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit">Send reset link</button>
      </form>

      {message && (
        <p className="info-message">{message}</p>
      )}

      <div className="bottom-link">
        Nhớ mật khẩu rồi? <a href="/login">Đăng nhập lại</a>
      </div>
    </div>
  </div>
);


}