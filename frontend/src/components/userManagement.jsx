import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userManagement.css";

export default function PublisherManagement() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPublishers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setPublishers(data.filter(u => u.roles === "publisher"));
    } catch (err) {
      console.warn("Using mock data...");
      setPublishers([
        {
          _id: "1",
          pubName: "John Doe",
          pubEmail: "john@gmail.com",
          pubAddress: "Somewhere",
          pubPhone: "123456789",
          pubDescription: "No bio yet",
          avatarUrl: "",
          roles: "publisher"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePublisher = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:3000/api/users/${id}`, { method: "DELETE" });
    loadPublishers();
  };

  const handleEditPublisher = (publisher) => {
    navigate(`/admin/users/edit/${publisher._id}`);
  };

  useEffect(() => {
    loadPublishers();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="publisher-page">
      <h2 className="header-title">Publisher Management</h2>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map(pub => (
              <tr key={pub._id}>
                <td>
                  <img
                    src={pub.avatarUrl || "/default-avt.jpg"}
                    className="avatar"
                    onError={(e) => e.target.src = "/default-avt.jpg"}
                  />
                </td>
                <td>{pub.pubName}</td>
                <td>{pub.pubEmail}</td>
                <td>
                  <button className="btn edit" onClick={() => handleEditPublisher(pub)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDeletePublisher(pub._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
