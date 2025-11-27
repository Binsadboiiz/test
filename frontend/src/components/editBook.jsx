import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/bookManagement.css";

const API_URL = "http://localhost:3000/api/books";
const PUBLISHER_API_URL = "http://localhost:3000/api/publishers";

export default function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublicationYear: "",
        bookGenre: [],
        publisher_id: "",
        thumbnailUrl: ""
    });

    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBook();
        loadPublishers();
    }, []);

    const loadPublishers = async () => {
        try {
            const res = await fetch(PUBLISHER_API_URL, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to load publishers");
            const data = await res.json();
            setPublishers(data);
        } catch (error) {
            HandleErrorAPI(error, navigate, "loadPublishers");
        }
    };

    const loadBook = async () => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to load book");
            const data = await res.json();
            setFormData({
                bookTitle: data.bookTitle || "",
                bookAuthor: data.bookAuthor || "",
                bookPublicationYear: data.bookPublicationYear || "",
                bookGenre: data.bookGenre || [],
                publisher_id: data.publisher_id?._id || "",
                thumbnailUrl: data.thumbnailUrl || ""
            });
        } catch (error) {
            HandleErrorAPI(error, navigate, "loadBook");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            publisher_id: formData.publisher_id?.trim() ? formData.publisher_id : null
        };

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to update book");
            alert("Book updated successfully!");
            navigate("/admin/books");
        } catch (error) {
            HandleErrorAPI(error, navigate, "handleSubmit");
        }
    };

    if (loading) return <p className="form-loading">Loading book...</p>;

    return (
        <div className="form-container">
            <h1 className="form-title">Edit Book</h1>
            <form onSubmit={handleSubmit} className="form-body">

                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="bookTitle"
                        value={formData.bookTitle}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        name="bookAuthor"
                        value={formData.bookAuthor}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Publication Year</label>
                    <input
                        type="number"
                        name="bookPublicationYear"
                        value={formData.bookPublicationYear}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Genre (comma separated)</label>
                    <input
                        type="text"
                        name="bookGenre"
                        value={formData.bookGenre.join(", ")}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                bookGenre: e.target.value.split(",").map(g => g.trim())
                            }))
                        }
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Publisher</label>
                    <select
                        name="publisher_id"
                        value={formData.publisher_id}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">Unknown</option>
                        {publishers.map(pub => (
                            <option key={pub._id} value={pub._id}>
                                {pub.publisherName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Thumbnail URL</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <button type="submit" className="form-btn form-btn-save">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
