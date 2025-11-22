import { useState } from "react";
import UserManagement from "../components/userManagement";
import BooksManagement from "../components/bookManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="adminDashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("publishers")}>Publishers</button>
        <button onClick={() => setActiveTab("books")}>Books</button>
      </div>

      <div className="tab-content" style={{ marginTop: "20px" }}>
        {activeTab === "users" && <UserManagement role="user" />}
        {activeTab === "publishers" && <UserManagement role="publisher" />}
        {activeTab === "books" && <BooksManagement />}
      </div>
    </div>
  );
}
