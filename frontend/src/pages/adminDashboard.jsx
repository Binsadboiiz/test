import { useState } from "react";
import UserManagement from "../components/userManagement";
import BooksManagement from "../components/bookManagement";
import "../styles/adminDashboard.css"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="adminDashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
      <button 
        className={activeTab === "publishers" ? "active" : ""} 
        onClick={() => setActiveTab("publishers")}
      >
        Publishers
      </button>
      <button 
        className={activeTab === "books" ? "active" : ""} 
        onClick={() => setActiveTab("books")}
      >
        Books
      </button>
    </div>


      <div className="tab-content" style={{ marginTop: "20px" }}>
        {activeTab === "users" && <UserManagement role="user" />}
        {activeTab === "publishers" && <UserManagement role="publisher" />}
        {activeTab === "books" && <BooksManagement />}
      </div>
    </div>
  );
}
