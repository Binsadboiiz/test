import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAvatarUrl } from "../utils/avatar.js";
import "../styles/profilepage.css";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api/profile`,
  withCredentials: true,
});

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [displayname, setDisplayname] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);



useEffect(() => {
  let isMounted = true;

  async function fetchProfile() {
    try {
      const resp = await api.get("/me"); 
      console.log("GET /me response:", resp);
      const payload = resp.data;
      const u = payload?.user ?? payload;
      if (!isMounted) return;
      setUser(u);
      setDisplayname(u?.displayname ?? u?.displayName ?? "");
      setAvatarPreview(u?.avatarUrl ? getAvatarUrl(u.avatarUrl) : null);
      setErr("");
    } catch (e) {
      console.error("fetchProfile error", e);
      if (!isMounted) return;
      setErr(e.response?.data?.message || "Không lấy được profile");
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  fetchProfile();
  return () => { isMounted = false; };
}, []);


  function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErr("Ảnh quá lớn (max 2MB)");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

async function submitProfile(e) {
  e.preventDefault();
  setMsg(""); setErr("");

  try {
    const form = new FormData();
    form.append("displayname", displayname); 
    if (avatarFile) form.append("avatar", avatarFile);

    const resp = await api.put("/me", form);
    console.log("PUT /me response:", resp);
    const payload = resp.data;
    const returnedUser = payload?.user ?? payload;

setMsg(payload.message || "Cập nhật thành công");
    if (returnedUser) {
    setUser(returnedUser);
 
    localStorage.setItem("user", JSON.stringify(returnedUser));
    if (returnedUser.avatarUrl) setAvatarPreview(getAvatarUrl(returnedUser.avatarUrl));
    }
    setAvatarFile(null);
  } catch (e) {
    console.error("submitProfile error", e);
    setErr(e.response?.data?.message || "Cập nhật thất bại");
  }
}


  async function submitPassword(e) {
    e.preventDefault();
    setMsg(""); setErr("");

    if (!currentPassword || !newPassword) {
      setErr("Nhập đủ mật khẩu hiện tại và mật khẩu mới");
      return;
    }

    try {
      const { data } = await api.put("/me/change-password", {
        currentPassword,
        newPassword,
      });
      setMsg(data.message || "Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      setErr(e.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  }

  if (loading) return <div className="profile-wrap"><div className="profile-loading">Đang tải...</div></div>;

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {err && <div className="alert alert-error">{err}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}

        <div className="profile-grid">
          <div className="profile-left">
            <div className="avatar-box">
              <img
                src={avatarPreview ? avatarPreview : "/default-avatar.png"}
                alt="avatar"
                className="avatar-img"
              />
            </div>

            <div className="meta">
              <div className="meta-row">
                <span className="meta-label">Username</span>
                <span className="meta-value">{user?.username}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Email</span>
                <span className="meta-value">{user?.email}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Role</span>
                <span className="meta-value">{(user?.roles || []).join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <form className="form" onSubmit={submitProfile}>
              <label className="form-label">Display name</label>
              <input
                className="form-input"
                value={displayname}
                onChange={(e) => setDisplayname(e.target.value)}
                maxLength={40}
                placeholder="Tên hiển thị..."
              />

              <label className="form-label">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="form-file"
              />
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Save profile</button>
              </div>
            </form>

            <hr className="divider" />

            <form className="form" onSubmit={submitPassword}>
              <label className="form-label">Current password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mật khẩu hiện tại"
              />

              <label className="form-label">New password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
              />

              <div className="form-actions">
                <button className="btn btn-ghost" type="submit">Change password</button>
              </div>
              <Link to="/publisher/register">Muốn làm publisher? Tiếp tục ở đây →</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
