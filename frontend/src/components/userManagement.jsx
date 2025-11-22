import { useEffect, useState } from "react";
import HandleErrorAPI from "../utils/handleErrorAPI";
import { useNavigate } from "react-router-dom";

export default function UserManagement({ roles }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayname: "",
    avatarUrl: "",
    roles: roles || "user",
  });

  const [editingUserId, setEditingUserId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data.filter(u => u.roles === roles)); 
    } catch (err) {
      HandleErrorAPI(err, navigate, "Fetch Users")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingUserId ? "PUT" : "POST";
      const url = editingUserId
        ? `http://localhost:3000/api/users/${editingUserId}`
        : "http://localhost:3000/api/users";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw res;

      setFormData({ username: "", displayname: "", email: "", password: "", avatarUrl: "", roles });
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      HandleErrorAPI(err, navigate, "Save User");
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      displayname: user.displayname,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
    });
    setEditingUserId(user._id);
  };

  const handleDeleteUser = async (_id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await fetch(`http://localhost:3000/api/users/${_id}`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      HandleErrorAPI(err, navigate, "Delete User");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-management">
      <h2>{roles === "publisher" ? "Publisher Management" : "User Management"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Display Name"
          value={formData.displayname}
          onChange={(e) => setFormData({ ...formData, displayname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editingUserId}
        />
        <button type="submit">{editingUserId ? "Update" : "Add"}</button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setFormData({ username: "", displayname: "", email: "", password: "", avatarUrl: "", roles });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border={1} cellPadding={5} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Display Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.displayname}</td>
              <td>{u.email}</td>
              <td>{u.roles}</td>
              <td>
                <button onClick={() => handleEditUser(u)}>Edit</button>
                <button onClick={() => handleDeleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
