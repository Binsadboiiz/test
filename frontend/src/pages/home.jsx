import { data } from "react-router-dom";
import "../styles/homepage.css";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("user");
    if (savedData) {
      setUser(JSON.parse(savedData));
    }
  }, []);

  return (
    <>
      <header className="header-container">
        <div className="logo">
          <img src="" alt="this's logo page" />
        </div>
        <div className="title-header">MINI - PROJECT</div>
        {!user && (
          <div className="btn-group">
            <button type="button" className="btn btn-primary">
              LOG IN
            </button>
            <button type="button" className="btn btn-primary">
              SIGN UP
            </button>
          </div>
        )}
        {user && (
          <div className="user-info">
            <span>Hi, {user.displayname}</span>
          </div>
        )}
      </header>

      <div className={`side-bar-left ${collapsed ? "collapsed" : ""}`}>
        <div className="btn-hidden" onClick={() => setCollapsed(!collapsed)}>
          <i className="bi bi-list-ul"></i>
        </div>

        <div className="btn-group">
          <div className="btn-home">
            <i className="bi bi-house"></i>
            <span>Home</span>
          </div>
        </div>
        <div className="btn-group">
          <div className="btn-list">
            <i className="bi bi-journals"></i>
            <span>List Books</span>
          </div>
        </div>
        <div className="btn-group">
          <div className="btn-fav">
            <i className="bi bi-heart"></i>
            <span>Favorites Books</span>
          </div>
        </div>
        <div className="btn-group">
          <div className="btn-threads">
            <i className="bi bi-threads"></i>
            <span>Threads</span>
          </div>
        </div>
        <div className="btn-out">
          <i className="bi bi-box-arrow-left"></i>
          <span>Log out</span>
        </div>
      </div>
    </>
  );
}
