import { useState } from "react";
import "../styles/adminDashboard.css"
import AdminUserManagement from "../components/admin/userManagement";
import AdminBookManagement from "../components/admin/bookManagement"

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
        User Management
      </button>
      <button 
        className={activeTab === "books" ? "active" : ""} 
        onClick={() => setActiveTab("books")}
      >
        Books
      </button>
    </div>


      <div className="tab-content" style={{ marginTop: "20px" }}>
        {activeTab === "users" && <AdminUserManagement role="user" />}
        {activeTab === "publishers" && <AdminUserManagement role="publisher" />}
        {activeTab === "books" && <AdminBookManagement />}
      </div>
    </div>
  );
}
