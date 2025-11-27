// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users",
});

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialToken = params.get("token") || "";
  const rawEmail = params.get("email") || "";
  const initialEmail = rawEmail ? decodeURIComponent(rawEmail) : "";

  const [token] = useState(initialToken); 
  const [email] = useState(initialEmail); 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token || !email) {
      setErr("Link reset không hợp lệ (thiếu token hoặc email).");
      return;
    }
    if (!password || password !== confirm) {
      setErr("Mật khẩu trống hoặc không khớp.");
      return;
    }
    if (password.length < 6) {
      setErr("Mật khẩu phải ít nhất 6 ký tự.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/reset-password", {
        email,
        token,
        password,
      });
      setMsg(data.message || "Đặt lại mật khẩu thành công");
      setPassword("");
      setConfirm("");
      setTimeout(() => navigate("/login"), 1400);
    } catch (error) {
      console.error("reset error", error);
      setErr(error.response?.data?.message || "Reset thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rp-page">
      <div className="rp-card">
        <h2 className="rp-title">Đặt lại mật khẩu</h2>

        {err && <div className="rp-alert rp-error">{err}</div>}
        {msg && <div className="rp-alert rp-success">{msg}</div>}

        <form className="rp-form" onSubmit={handleSubmit}>
          <label className="rp-label">Email</label>
          <input className="rp-input" value={email} readOnly />

          <label className="rp-label">Mật khẩu mới</label>
          <input
            className="rp-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            autoFocus
          />

          <label className="rp-label">Xác nhận mật khẩu</label>
          <input
            className="rp-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Nhập lại mật khẩu"
          />

          <button className="rp-btn" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>

          <div className="rp-footer">
            <button
              type="button"
              className="rp-link"
              onClick={() => navigate("/login")}
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
