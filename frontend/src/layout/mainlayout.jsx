import "../styles/mainlayout.css";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../utils/avatar";

export default function MainLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  const roles = user?.roles || [];

  const handleHome = () => {
    if (roles === "admin") navigate("/admin/dashboard");
    else if (roles === "publisher") navigate("/publisher/dashboard");
    else navigate("/");
  };

  const handleListBooks = () => {
    if (roles === "admin") navigate("/admin/books");
    else if (roles === "publisher") navigate("/publisher/books");
    else navigate("/books");
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header-container">
        <div className="logo">
          <img alt="Logo page" />
        </div>
        <div className="title-header">MINI - PROJECT</div>
        {!user && (
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              LOG IN
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              SIGN UP
            </button>
          </div>
        )} 
        {user && (
            <div className="user-info">
              <div className="user-avatar-wrap">
                <img
                  src={getAvatarUrl(user.avatarUrl)}
                  alt="avatar"
                  className="user-avatar"
                />
              </div>
              <span>Hi, {user.displayname}</span>
            </div>
          )}
      </header>

      {/* Sidebar */}
      <div className={`side-bar-left ${collapsed ? "collapsed" : ""}`}>
        <div className="btn-hidden" onClick={() => setCollapsed(!collapsed)}>
          <i className="bi bi-list-ul"></i>
        </div>

        <div className="btn-group" onClick={handleHome}>
          <i className="bi bi-house"></i>
          <span>Home</span>
        </div>

        <div className="btn-group" onClick={handleListBooks}>
          <i className="bi bi-journals"></i>
          <span>List Books</span>
        </div>

        {/* Favorites only for reader/publisher */}
        {(roles.includes("user") || roles.includes("publisher")) && (
          <div className="btn-group" onClick={()=> navigate('/favorites')}>
            <i className="bi bi-heart"></i>
            <span>Favorites Books</span>
          </div>
        )}

        {/* Threads for all */}
        <div className="btn-group" onClick={()=> navigate('/forum')}>
          <i className="bi bi-threads"></i>
          <span>Threads</span>
        </div>

        {(roles.includes("user")) && (
          <div className="btn-group" onClick={()=> navigate('/profile')}>
            <i className="bi bi-person-square"></i>
            <span>Profile</span>
          </div>
        )}

        {/* Admin only */}
        {(roles.includes("admin")) && (
          <div className="btn-group" onClick={()=> navigate('/admin/dashboard')}>
            <i className="bi bi-heart"></i>
            <span>Admin dashboard</span>
          </div>
        )}


        {/* Logout */}
        {user && (
          <div className="btn-out" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Log out</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`content-right ${collapsed ? "collapsed" : ""}`}>
        <Outlet />
      </div>
    </>
  );
}
