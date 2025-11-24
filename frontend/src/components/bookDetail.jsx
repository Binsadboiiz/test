import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/bookdetail.css";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/books/${id}`);
      const data = await res.json();

      setBook(data.book || data);
    } catch (error) {
      HandleErrorAPI(error, navigate, "BookDetail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const handleAddFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/my-favorite-books/${book._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to add favorite");
      alert("Đã thêm vào danh sách yêu thích!");
    } catch (error) {
      HandleErrorAPI(error, navigate, "BookDetail-Favorite");
    }
  };

  const handleRate = async (rating) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      
      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookId: book._id, rating }),
      });

      if (!res.ok) throw new Error("Failed to rate");

      setBook((prev) => {
        if (!prev) return prev;
        const oldAvg = prev.averageRating || 0;
        const oldNum = prev.numOfReviews || 0;
        const newNum = oldNum + 1;
        const newAvg = (oldAvg * oldNum + rating) / newNum;
        return { ...prev, averageRating: newAvg, numOfReviews: newNum };
      });
    } catch (error) {
      HandleErrorAPI(error, navigate, "BookDetail-Rate");
    }
  };

  if (loading || !book) {
    return <div className="bookdetail-loading">Loading book...</div>;
  }

  return (
    <div className="bookdetail-wrapper">
      <div className="bookdetail-main-card">
        {/* LEFT: ảnh bìa */}
        <div className="bookdetail-cover">
          <img src={book.thumbnailUrl} alt={book.bookTitle} />
        </div>

        {/* RIGHT: info */}
        <div className="bookdetail-info">
          <h1 className="bookdetail-title">{book.bookTitle}</h1>
          <p className="bookdetail-author">by {book.bookAuthor}</p>

          <div className="bookdetail-meta">
            {book.bookGenre && (
              <span className="meta-pill">{book.bookGenre}</span>
            )}
            {book.bookPublicationYear && (
              <span className="meta-pill">Year: {book.bookPublicationYear}</span>
            )}
            {book.publisher_id?.pubName && (
              <span className="meta-pill">
                Publisher: {book.publisher_id.pubName}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="bookdetail-rating-row">
            <StarRating
              rating={book.averageRating || 0}
              onRate={handleRate}
            />
            <span className="bookdetail-rating-text">
              {book.averageRating
                ? book.averageRating.toFixed(1)
                : "Chưa có rating"}
              {` · `}
              {book.numOfReviews || 0} reviews
            </span>
          </div>

          {/* Nút action */}
          <div className="bookdetail-actions">
            <button
              className="btn-primary-detail"
              onClick={handleAddFavorite}
            >
              ♥ Add to favorites
            </button>
            <button
              className="btn-outline-detail"
              onClick={() => navigate("/books")}
            >
              Back to list
            </button>
          </div>

          {/* Description */}
          <div className="bookdetail-description">
            <h2>About this book</h2>
            <p>{book.bookDescription || "Chưa có mô tả cho cuốn sách này."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function StarRating({ rating = 0, onRate }) {
  const rounded = Math.round(rating * 2) / 2;

  const handleClick = (value) => {
    if (typeof onRate === "function") onRate(value);
  };

  return (
    <div className="bookdetail-stars">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFull = value <= Math.floor(rounded);
        const isHalf = !isFull && value - rounded === 0.5;

        return (
          <span
            key={value}
            className={`star ${isFull ? "full" : ""} ${
              isHalf ? "half" : ""
            }`}
            onClick={() => handleClick(value)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
