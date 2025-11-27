import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HandleErrorAPI from "../utils/handleErrorAPI";
import { getAvatarUrl } from "../utils/avatar.js";
import "../styles/bookdetail.css";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/comments/book/${id}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    fetchBookDetail();
    fetchComments();
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const res = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ book: id, content: commentText.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:""}));
        throw new Error(err.message || "Failed to add comment");
      }
      const data = await res.json();
      setComments(prev => [data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      console.error("Add comment error", error);
      HandleErrorAPI(error, navigate, "BookDetail-CommentAdd");
    } finally {
      setCommentLoading(false);
    }
  };


  const handleDeleteComment = async (commentId) => {
    if (!user) { navigate("/login"); return; }
    if (!window.confirm("Xoá bình luận này?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      // remove from UI
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment error", err);
      HandleErrorAPI(err, navigate, "BookDetail-CommentDelete");
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

          {/* ---------- COMMENTS ---------- */}
          <div className="bookdetail-comments">
            <h3>Bình luận ({comments.length})</h3>

            {user ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <textarea
                  className="comment-input"
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />
                <div className="comment-actions">
                  <button className="comment-btn" type="submit" disabled={commentLoading}>
                    {commentLoading ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="comment-login-cta">
                <button className="btn-link" onClick={() => navigate("/login")}>Đăng nhập để bình luận</button>
              </div>
            )}

            <div className="comments-list">
              {comments.length === 0 && <div className="muted">Chưa có bình luận nào. Hãy là người đầu tiên!</div>}
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <div className="comment-avatar samill-avatar">
                    {c.user?.avatarUrl ? (
                      <img
                        src={getAvatarUrl(c.user.avatarUrl)}
                        alt={c.user?.displayname || c.user?.username || "avatar"}
                        className="avatar-img"
                      />
                    ) : (
                      <span className="avatar-initial">
                        {(c.user?.displayname || c.user?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong>{c.user?.displayname || c.user?.username}</strong>
                      <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
                      {(user && (user._id === c.user?._id || user.roles?.includes?.("admin") || user.isAdmin)) && (
                        <button className="comment-delete" onClick={() => handleDeleteComment(c._id)}>Xoá</button>
                      )}
                    </div>
                    <div className="comment-content">{c.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* ---------- END COMMENTS ---------- */}

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
