import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/home.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTopBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/books/top-rate?limit=12`);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response for top-rate:', contentType, text);
        throw new Error('Server returned non-JSON response. Check backend logs.');
      }

      const data = await res.json();
      setBooks(data.books || []);
    } catch (error) {
      HandleErrorAPI(error, navigate, "HomePage.fetchTopBook");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopBooks();
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/books/${id}`);
  };

  const handleAddFavorite = async (bookId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/my-favorite-books/${bookId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to add favorite");
     
    } catch (error) {
      HandleErrorAPI(error, navigate, "HomePage-Favorite");
    }
  };

  const handleRate = async (bookId, rating) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookId, rating }),
      });
      if (!res.ok) throw new Error("Failed to rate");

      setBooks((prev) =>
        prev.map((b) =>
          b._id === bookId
            ? {
                ...b,
                averageRating:
                  (b.averageRating * b.numOfReviews + rating) /
                  (b.numOfReviews + 1),
                numOfReviews: (b.numOfReviews || 0) + 1,
              }
            : b
        )
      );
    } catch (error) {
      HandleErrorAPI(error, navigate, "HomePage-Rate");
    }
  };

  return (
    <div className="home-wrapper">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-text">
          <h1>Discover your next favorite book</h1>
          <p>
            Những cuốn sách được đánh giá cao nhất từ cộng đồng, cập nhật liên
            tục theo lượt rating.
          </p>
          <button onClick={() => navigate("/books")} className="hero-btn">
            View all books
          </button>
        </div>
      </section>

      {/* Highlight section */}
      <section className="highlight-section">
        <div className="highlight-header">
          <h2>Featured books</h2>
          <span>Top rated by readers</span>
        </div>

        {loading && (
          <div className="home-loading">Loading featured books...</div>
        )}

        {!loading && books.length === 0 && (
          <div className="home-empty">Chưa có sách nào được đánh giá.</div>
        )}

        <div className="highlight-grid">
          {books.map((book) => (
            <div key={book._id} className="highlight-card">
              <div
                className="highlight-cover"
                onClick={() => handleViewDetail(book._id)}
              >
                <img src={book.thumbnailUrl} alt={book.bookTitle} />
              </div>

              <div className="highlight-info">
                <h3 onClick={() => handleViewDetail(book._id)}>
                  {book.bookTitle}
                </h3>
                <p className="highlight-author">{book.bookAuthor}</p>
                <p className="highlight-genre">{book.bookGenre}</p>

                <div className="highlight-rating-row">
                  <StarRating
                    rating={book.averageRating || 0}
                    onRate={(value) => handleRate(book._id, value)}
                  />
                  <span className="rating-text">
                    {book.averageRating?.toFixed(1) || "0.0"} ·{" "}
                    {book.numOfReviews || 0} reviews
                  </span>
                </div>

                <div className="highlight-actions">
                  <button
                    className="btn-detail"
                    onClick={() => handleViewDetail(book._id)}
                  >
                    View detail
                  </button>
                  <button
                    className="btn-favorite"
                    onClick={() => handleAddFavorite(book._id)}
                  >
                    ♥ Add to favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


function StarRating({ rating = 0, onRate }) {
  const rounded = Math.round(rating * 2) / 2; 

  const handleClick = (value) => {
    if (typeof onRate === "function") onRate(value);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFull = value <= Math.floor(rounded);
        const isHalf = !isFull && value - rounded === 0.5;

        return (
          <span
            key={value}
            className={`star ${isFull ? "full" : ""} ${isHalf ? "half" : ""}`}
            onClick={() => handleClick(value)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
