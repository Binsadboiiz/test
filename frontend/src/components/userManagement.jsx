import { useEffect, useState } from "react";

export default function UserManagement({ role }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayname: "",
    avatarUrl: "",
    role: role || "user",
  });

  const [editingUserId, setEditingUserId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data.filter(u => u.role === role)); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [role]);

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

      if (!res.ok) throw new Error("Failed to save user");

      setFormData({ username: "", displayname: "", email: "", password: "", avatarUrl: "", role });
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      displayname: user.displayname,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
    setEditingUserId(user._id);
  };

  const handleDeleteUser = async (_id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await fetch(`http://localhost:3000/api/users/${_id}`, { method: "DELETE" });
      loadUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-management">
      <h2>{role === "publisher" ? "Publisher Management" : "User Management"}</h2>

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
              setFormData({ username: "", displayname: "", email: "", password: "", avatarUrl: "", role });
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
              <td>{u.role}</td>
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
