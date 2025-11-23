import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userManagement.css";

export default function PublisherManagement() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booksByPublisher, setBooksByPublisher] = useState({});
  const navigate = useNavigate();

  // Load danh sách publishers
  const loadPublishers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      const nxb = data.filter(u => u.roles === "publisher");
      setPublishers(nxb);

      // Load sách của từng publisher
      const booksRes = await fetch("http://localhost:3000/api/books");
      const booksData = await booksRes.json();

      const mapBooks = {};
      nxb.forEach(pub => {
        mapBooks[pub._id] = booksData.filter(b => b.publisher_id === pub._id);
      });
      setBooksByPublisher(mapBooks);

    } catch (err) {
      console.warn("Using mock data for test...");
      const mockPublishers = [
        {
          _id: "1",
          username: "john_doe",
          displayname: "John Doe",
          email: "john@gmail.com",
          avatarUrl: "",
          roles: "publisher",
        },
      ];
      const mockBooks = [
        { _id: "b1", title: "Book 1", publisher_id: "1" },
        { _id: "b2", title: "Book 2", publisher_id: "1" },
      ];
      setPublishers(mockPublishers);
      setBooksByPublisher({ "1": mockBooks });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishers();
  }, []);

  const handleDeletePublisher = async (publisherId) => {
    if (!window.confirm("Are you sure you want to delete this publisher?")) return;
    try {
      await fetch(`http://localhost:3000/api/users/${publisherId}`, { method: "DELETE" });
      loadPublishers();
    } catch (err) {
      console.error("Error deleting publisher", err);
    }
  };

  const handleEditPublisher = (publisher) => {
    navigate(`/admin/users/edit/${publisher._id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="publisher-management">
      <h2>Publisher Management</h2>
      <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map(pub => (
            <tr key={pub._id}>
              <td>
                <img
                  src={pub.avatarUrl || "/default-avt.jpg"}
                  alt="avatar"
                  onError={(e) => { e.target.src = "/default-avt.jpg"; }}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </td>
              <td>{pub.displayname || pub.username}</td>
              <td>{pub.email}</td>
              <td>
                {booksByPublisher[pub._id] && booksByPublisher[pub._id].length > 0
                  ? booksByPublisher[pub._id].map(b => b.title).join(", ")
                  : "No books"}
              </td>
              <td>
                <button onClick={() => handleEditPublisher(pub)}>Edit</button>
                <button onClick={() => handleDeletePublisher(pub._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
