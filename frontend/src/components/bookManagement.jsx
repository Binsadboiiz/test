import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";

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

            const res = await fetch(API_URL, {
                method: "GET",
                credentials: "include"
            });

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
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Failed to delete");

            setBooks(books.filter(book => book._id !== id));

        } catch (error) {
            HandleErrorAPI(error);
        }
    };

    if (loading) return <p className="text-center mt-6">Loading..</p>;

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">Quản lý sách (Admin)</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Ảnh</th>
                        <th className="border p-2">Tiêu đề</th>
                        <th className="border p-2">Tác giả</th>
                        <th className="border p-2">Năm XB</th>
                        <th className="border p-2">Thể loại</th>
                        <th className="border p-2">Nhà XB</th>
                        <th className="border p-2">Rating</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(book => (
                        <tr key={book._id} className="text-center hover:bg-gray-50">
                            <td className="border p-2">
                                <img 
                                    src={book.thumbnailUrl || "https://via.placeholder.com/60"} 
                                    alt="thumbnail" 
                                    className="w-12 h-16 object-cover mx-auto rounded"
                                />
                            </td>
                            <td className="border p-2 font-semibold">{book.bookTitle}</td>
                            <td className="border p-2">{book.bookAuthor}</td>
                            <td className="border p-2">{book.bookPublicationYear}</td>
                            <td className="border p-2">
                                {book.bookGenre?.length > 0 ? book.bookGenre.join(", ") : "—"}
                            </td>
                            <td className="border p-2">
                                {book.publisher_id?.publisherName || "Không rõ"}
                            </td>
                            <td className="border p-2">
                                ⭐ {book.averageRating} ({book.numOfReviews})
                            </td>
                            <td className="border p-2 space-x-2">
                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded"
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
