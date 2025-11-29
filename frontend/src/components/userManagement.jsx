import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userManagement.css";
import HandleErrorAPI from "../utils/handleErrorAPI";
import { getAvatarUrl } from "../utils/avatar";

function Modal({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="am-modal-backdrop">
      <div className="am-modal">
        <div className="am-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="am-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    username: "",
    displayname: "",
    email: "",
    roles: "user", 
    avatarUrl: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [publisherRequests, setPublisherRequests] = useState([]);


  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      if (!res.ok) throw new Error("Fail fetching users");
      const data = await res.json();
      setUsers(data);

      setPublisherRequests(data.filter(u => u.publisherRequest === "pending"));
      setPublishers(data.filter(u => u.roles === "publisher"));
    } catch (err) {
      HandleErrorAPI(err, navigate, "Failed to load users");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreate() {
    setSelectedUser(null);
    setFormState({
      username: "",
      displayname: "",
      email: "",
      roles: "user",
      avatarUrl: "",
    });
    setErrorMsg("");
    setShowForm(true);
  }

  function openEdit(user) {
    setSelectedUser(user);

    let roleValue = "user";
    if (Array.isArray(user.roles)) {
      if (user.roles.includes("publisher")) roleValue = "publisher";
      else if (user.roles.includes("admin")) roleValue = "admin";
      else roleValue = user.roles[0] || "user";
    } else if (typeof user.roles === "string") {
      roleValue = user.roles;
    }

    setFormState({
      username: user.username || "",
      displayname: user.displayname || "",
      email: user.email || "",
      roles: roleValue,
      avatarUrl: user.avatarUrl || "",
    });
    setErrorMsg("");
    setShowForm(true);
}


  async function submitForm(e) {
    e.preventDefault();
    setErrorMsg("");
    const payload = {
      username: formState.username,
      displayname: formState.displayname,
      email: formState.email,
      roles: Array.isArray(formState.roles) ? formState.roles : [formState.roles], 
      avatarUrl: formState.avatarUrl,
    };

    try {
      if (selectedUser) {

        const res = await fetch(`http://localhost:3000/api/users/${selectedUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch(`http://localhost:3000/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(()=>null);
          throw new Error(errData?.message || "Create failed");
        }
      }
      await loadUsers();
      setShowForm(false);
    } catch (err) {
      setErrorMsg(err.message || "Error");
    }
  }

  async function approveRequest(user) {
    await fetch(`http://localhost:3000/api/publisher-request/approve/${user._id}`, {
      method: "PUT",
    });
    loadUsers();
  }

  async function rejectRequest(user) {
    await fetch(`http://localhost:3000/api/publisher-request/reject/${user._id}`, {
      method: "PUT",
    });
    loadUsers();
  }


  async function handleDelete(userId) {
    if (!window.confirm("Xác nhận xóa tài khoản này?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      HandleErrorAPI(err, navigate, "Delete user error");
    }
  }

  async function toggleBlock(user) {
    const action = user.isBlocked ? "unblock" : "block";
    if (!window.confirm(`${user.isBlocked ? "Mở khóa" : "Khoá"} tài khoản ${user.username}?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${user._id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: !user.isBlocked }),
      });
      if (!res.ok) throw new Error("Block/unblock failed");
      const updated = await res.json();
      setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
    } catch (err) {
      HandleErrorAPI(err, navigate, "Block/unblock user error");
    }
  }

  function viewPublisher(pub) {
    navigate(`/admin/publishers/${pub._id}`);
  }

  const filtered = users.filter(u =>
    !query ||
    (u.username && u.username.toLowerCase().includes(query.toLowerCase())) ||
    (u.displayname && u.displayname.toLowerCase().includes(query.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="admin-user-management">
      <h2>Admin — User Management</h2>

      <div className="am-controls">
        <input placeholder="Search username, name, email..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={openCreate}>+ Create user</button>
        <button onClick={loadUsers}>Refresh</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="am-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className={u.isBlocked ? "am-blocked" : ""}>
                <td>
                  <img
                    src={(getAvatarUrl(u.avatarUrl))|| "/default-avt.jpg"}
                    alt="avt"
                    onError={(e) => e.target.src = "/default-avt.jpg"}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                </td>
                <td>{u.username}</td>
                <td>{u.displayname}</td>
                <td>{u.email}</td>
                <td>{Array.isArray(u.roles) ? u.roles.join(", ") : u.roles}</td>
                <td>{u.isBlocked ? "Yes" : "No"}</td>
                <td>
                  <button className="am-btn am-btn-edit" onClick={() => openEdit(u)}>Edit</button>
                  <button className="am-btn am-btn-delete" onClick={() => handleDelete(u._id)}>Delete</button>
                  <button 
                    className={`am-btn ${u.isBlocked ? "am-unblock" : "am-block"}`}
                    onClick={() => toggleBlock(u)}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  {u.roles === "publisher" && (
                    <button className="am-btn am-btn-pub" onClick={() => viewPublisher(u)}>
                      Publisher
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}>No users found</td></tr>
            )}
          </tbody>
        </table>
      )}

      <h3>Publishers</h3>
      <div className="am-publishers">
        {publishers.length === 0 && <p>No publishers yet</p>}
        {publishers.map(p => (
          <div key={p._id} className="am-publisher-card">
            <img src={p.avatarUrl || "/default-avt.jpg"} onError={(e)=>e.target.src="/default-avt.jpg"} alt="pub" />
            <div>
              <strong>{p.displayname || p.username}</strong>
              <div>{p.email}</div>
              <div className="am-pub-actions">
                <button onClick={() => viewPublisher(p)}>Manage</button>
                <button onClick={() => openEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showForm} title={selectedUser ? "Edit user" : "Create user"} onClose={() => setShowForm(false)}>
        <form onSubmit={submitForm} className="am-form">
          <label>Username
            <input value={formState.username} onChange={e => setFormState({...formState, username: e.target.value})} required />
          </label>
          <label>Display name
            <input value={formState.displayname} onChange={e => setFormState({...formState, displayname: e.target.value})} />
          </label>
          <label>Email
            <input type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} required />
          </label>
          <label>Role
            <select value={formState.roles} onChange={e => setFormState({...formState, roles: e.target.value})}>
              <option value="user">User</option>
              <option value="publisher">Publisher</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label>Avatar URL
            <input value={formState.avatarUrl} onChange={e => setFormState({...formState, avatarUrl: e.target.value})} />
          </label>
          {errorMsg && <div className="am-error">{errorMsg}</div>}
          <div className="am-form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <h2>Publisher Requests</h2>
      {publisherRequests.map(u => (
        <div className="request-card" key={u._id}>
          <p>{u.username}</p>
          <p>{u.email}</p>

          <button onClick={() => approveRequest(u)}>Approve</button>
          <button onClick={() => rejectRequest(u)}>Reject</button>
        </div>
      ))}

    </div>
    
  );
}
