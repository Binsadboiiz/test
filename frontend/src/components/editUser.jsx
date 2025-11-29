import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/userManagement.css";
import HandleErrorAPI from "../utils/handleErrorAPI";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditPublisher() {
  const { publisherId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    displayname: "",
    email: "",
    roles: "publisher",
    avatarUrl: "",
    avatarFile: null,
  });

  useEffect(() => {
    const loadPublisher = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${publisherId}`);
        const data = await res.json();
        setFormData({
          username: data.username,
          displayname: data.displayname,
          email: data.email,
          roles: data.roles || "publisher",
          avatarUrl: data.avatarUrl,
          avatarFile: null,
        });
      } catch (err) {
        HandleErrorAPI(err, navigate, "Faild to fetch")
        setFormData({
          username: "demo_user",
          displayname: "Demo Publisher",
          email: "demo@gmail.com",
          roles: "publisher",
          avatarUrl: "",
          avatarFile: null,
        });
      }
    };
    loadPublisher();
  }, [publisherId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatarFile: file,
        avatarUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("displayname", formData.displayname);
      formPayload.append("email", formData.email);
      formPayload.append("roles", formData.roles);
      if (formData.avatarFile) formPayload.append("avatar", formData.avatarFile);

      const res = await fetch(`${API_URL}/api/users/${publisherId}`, {
        method: "PUT",
        body: formPayload,
      });

      if (!res.ok) throw res;
      navigate("/admin/publishers");
    } catch (err) {
      console.error("Error updating publisher", err);
      alert("Update failed!");
    }
  };

  return (
    <div className="publisher-management" style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Edit Publisher</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center" }}>
          <img
            src={formData.avatarUrl || "/default-avt.jpg"}
            alt="avatar"
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
            onError={(e) => (e.target.src = "/default-avt.jpg")}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {/* Display Name */}
        <input
          type="text"
          placeholder="Display Name"
          value={formData.displayname}
          onChange={(e) => setFormData({ ...formData, displayname: e.target.value })}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Role */}
        <select
          value={formData.roles}
          onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="publisher">Publisher</option>
        </select>

        <button type="submit" className="edit-btn" style={{ alignSelf: "flex-start" }}>
          Update
        </button>
      </form>
    </div>
  );
}
