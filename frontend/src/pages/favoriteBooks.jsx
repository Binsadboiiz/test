import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/favoritepage.css";

const API_URL = "http://localhost:3000/api/users";

export default function FavoriteBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorite = async () => {
            try {
                setLoading(true);
                
                const res = await fetch(`${API_URL}/my-favorite-books`, {
                    method: "GET",
                    credentials: "include"
                });

                if(!res.ok) throw res;
                
                const data = await res.json();
                setBooks(data.results || []);
            } catch (error) {
                HandleErrorAPI(error, navigate, "FavoriteBooksPage.fetchFavorite")
            } finally {
                setLoading(false);
            }
        }
        fetchFavorite();
    }, [navigate]);

    const handleGoDetail = (bookId) => {
        navigate(`/books/${bookId}`);
    }

    if(loading) {
        return(
            <div className="favorite-page">
                <h1>Favorite Books</h1>
                <p>Đang tải danh sách yêu thích....</p>
            </div>
        );
    }

    if(!books.length) {
        return(
            <div className="favorite-page">
                <h1>Favorite Books</h1>
                <p>Hiện tại danh sách trống.</p>
            </div>
        );
    }

    return (
        <div className="favorite-page">
            <h1>Favorite Books</h1>
            <div className="book-gird">{books.map((book) => (
                <div key={book._id} className="book-card" onClick={()=> handleGoDetail(book._id)}>
                    <div className="thumb-wrapper">{book.thumbnailUrl ? (
                        <img src={book.thumbnailUrl} alt={book.bookTitle} />
                    ) : (
                        <div className="thumb-placeholder">No Image</div>
                    )}
                    </div>
                    <div className="book-info">
                        <h3>{book.bookTitle}</h3>
                        <p className="author">{book.bookAuthor}</p>
                        {book.publisher_id && (
                            <p className="publisher">{book.publisher_id.pubName}</p>
                        )}
                        <p className="year-rating">
                            <span>{book.bookPublicationYear}</span>
                            {typeof book.averageRating === "number" && (
                                <span>{book.averageRating}<i class="bi bi-star-fill"></i></span>
                            )}
                        </p>
                        {Array.isArray(book.bookGenre)  && book.bookGenre.length > 0 && (
                            <div className="genres">{book.bookGenre.map((g, idx) => (
                                <span key={idx} className="genre-tag">{g}</span>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}