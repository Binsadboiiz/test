import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/userManagement.css";

export default function EditPublisher() {
  const { publisherId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pubName: "",
    pubAddress: "",
    pubPhone: "",
    pubEmail: "",
    pubDescription: "",
    roles: "publisher",
    avatarUrl: "",
    avatarFile: null,
  });

  useEffect(() => {
    const loadPublisher = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${publisherId}`);
        const data = await res.json();
        setFormData({
          pubName: data.pubName,
          pubAddress: data.pubAddress,
          pubPhone: data.pubPhone,
          pubEmail: data.pubEmail,
          pubDescription: data.pubDescription,
          roles: data.roles || "publisher",
          avatarUrl: data.avatarUrl,
          avatarFile: null,
        });
      } catch (err) {
        console.warn("Using mock data...");
        setFormData({
          _id: "1",
          pubName: "john doe",
          pubAddress: "somewhere",
          pubPhone: 123456789,
          displayname: "John Doe",
          pubEmail: "john@gmail.com",
          pubDescription: "no bio yet",
          avatarUrl: "",
          roles: "publisher",
          avatarFile: null
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
      formPayload.append("pubName", formData.pubName);
      formPayload.append("pubAddress", formData.pubAddress);
      formPayload.append("pubPhone", formData.pubPhone);
      formPayload.append("pubEmail", formData.pubEmail);
      formPayload.append("pubDescription", formData.pubDescription);
      formPayload.append("roles", formData.roles);
      if (formData.avatarFile) formPayload.append("avatar", formData.avatarFile);

      const res = await fetch(`http://localhost:3000/api/users/${publisherId}`, {
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
          placeholder="Publisher Name"
          value={formData.pubName}
          onChange={(e) => setFormData({ ...formData,pubName: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Publisher Address"
          value={formData.pubAddress}
          onChange={(e) => setFormData({ ...formData, pubAddress: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Publisher Email"
          value={formData.pubEmail}
          onChange={(e) => setFormData({ ...formData, pubEmail: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Publisher Phone"
          value={formData.pubPhone}
          onChange={(e) => setFormData({ ...formData, pubPhone: e.target.value })}
          required
        />
       
        <input
          type="text"
          placeholder="Publisher Description"
          value={formData.pubDescription}
          onChange={(e) => setFormData({ ...formData, pubDescription: e.target.value })}
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
