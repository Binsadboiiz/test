import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/bookManagement.css";

const API_URL = "http://localhost:3000/api/books";

export default function BooksManagement() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL, { method: "GET", credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch books");
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            HandleErrorAPI(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id) => {
        if (!window.confirm("Are you sure to delete this book?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
            if (!res.ok) throw new Error("Failed to delete this book");
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            HandleErrorAPI(error);
        }
    };

    if (loading) return <p className="books-loading">Loading...</p>;

    return (
        <div className="books-container">

            <h1 className="books-title">Book Management (Admin)</h1>

            <table className="books-table">
                <thead>
                    <tr className="books-table-header">
                        <th>Image</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year Publish</th>
                        <th>Genre</th>
                        <th>Publisher</th>
                        <th>Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(book => (
                        <tr key={book._id} className="books-table-row">
                            <td>
                                <img 
                                    src={book.thumbnailUrl} 
                                    alt="thumbnail" 
                                    className="books-img"
                                />
                            </td>
                            <td className="books-title-cell">{book.bookTitle}</td>
                            <td>{book.bookAuthor}</td>
                            <td>{book.bookPublicationYear}</td>
                            <td>
                                {book.bookGenre?.length > 0 ? book.bookGenre.join(", ") : "—"}
                            </td>
                            <td>
                                {book.publisher_id?.publisherName || "404"}
                            </td>
                            <td>
                                ⭐ {book.averageRating} ({book.numOfReviews})
                            </td>
                            <td className="books-action-cell">
                                <button
                                    className="books-btn books-btn-edit"
                                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="books-btn books-btn-delete"
                                    onClick={() => deleteBook(book._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
