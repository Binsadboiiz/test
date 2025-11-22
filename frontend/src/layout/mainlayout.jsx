import "../styles/mainlayout.css";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const role = user?.role;

  const handleHome = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "publisher") navigate("/publisher/dashboard");
    else navigate("/");
  };

  const handleListBooks = () => {
    if (role === "admin") navigate("/admin/books");
    else if (role === "publisher") navigate("/publisher/books");
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
          <img src="" alt="Logo page" />
        </div>
        <div className="title-header">MINI - PROJECT</div>
        {!user ? (
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              LOG IN
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              SIGN UP
            </button>
          </div>
        ) : (
          <div className="user-info">
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
        {(role === "user" || role === "publisher") && (
          <div className="btn-group">
            <i className="bi bi-heart"></i>
            <span>Favorites Books</span>
          </div>
        )}

        {/* Threads for all */}
        <div className="btn-group">
          <i className="bi bi-threads"></i>
          <span>Threads</span>
        </div>

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
