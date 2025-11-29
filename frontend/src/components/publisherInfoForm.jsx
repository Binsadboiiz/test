import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/publisherForm.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function PublisherRequestForm({ onSuccess }) {
  // Lấy userId từ localStorage
  let userId = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed._id) userId = parsed._id;
    }
  } catch (err) {
    console.log("Error parsing user:", err);
  }
  if (!userId) userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    pubName: "",
    pubAddress: "",
    pubPhone: "",
    pubEmail: "",
    pubDescription: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.pubName || !form.pubPhone || !form.pubEmail) {
      setError("Vui lòng nhập tên, số điện thoại và email liên hệ.");
      return;
    }

    if (!userId) {
      setError("Bạn cần đăng nhập trước khi đăng ký publisher.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/publisher/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...form }),
        credentials: "include" // gửi cookie token nếu cần
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gửi yêu cầu thất bại");

      setSuccess("Yêu cầu của bạn đã được gửi. Chờ admin duyệt.");
      if (onSuccess) onSuccess(data); // data có thể là request object
      setForm({ pubName: "", pubAddress: "", pubPhone: "", pubEmail: "", pubDescription: "" });
    } catch (err) {
      setError(err.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pub-register-card">
      <h2 className="pub-title">Yêu cầu trở thành Publisher</h2>

      {error && <div className="pub-error">{error}</div>}
      {success && <div className="pub-success">{success}</div>}

      <form className="pub-form" onSubmit={handleSubmit}>
        <div className="pub-row">
          <label>Tên nhà xuất bản *</label>
          <input name="pubName" value={form.pubName} onChange={handleChange} required />
        </div>

        <div className="pub-row">
          <label>Địa chỉ</label>
          <input name="pubAddress" value={form.pubAddress} onChange={handleChange} />
        </div>

        <div className="pub-row">
          <label>Số điện thoại *</label>
          <input name="pubPhone" value={form.pubPhone} onChange={handleChange} required />
        </div>

        <div className="pub-row">
          <label>Email liên hệ *</label>
          <input name="pubEmail" value={form.pubEmail} onChange={handleChange} required />
        </div>

        <div className="pub-row">
          <label>Mô tả</label>
          <textarea name="pubDescription" value={form.pubDescription} onChange={handleChange} />
        </div>

        <Link to="/login" className="text-sm text-blue-600 mt-2 block">Về Trang Đăng nhập</Link>

        <div className="pub-actions">
          <button type="submit" className="pub-btn" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
