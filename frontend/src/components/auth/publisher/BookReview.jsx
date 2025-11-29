import { useEffect, useState } from "react";
import "../../../styles/bookReview.css";
import { getAvatarUrl } from "../../../utils/avatar";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookReviews({ bookId, onClose }) {
  
  const [reviewFeedback, setReviewFeedback] = useState([]);  
  const [comments, setComments] = useState([]);             
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        const res = await fetch(
          `${API_URL}/api/reviews/book/${bookId}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (mounted) {
          const reviewsArray = Array.isArray(data)
            ? data
            : data.reviews || [];

          setReviewFeedback(
            reviewsArray.filter(r => r.feedbackText?.trim() !== "")
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function loadComments() {
      try {
        const res = await fetch(
          `${API_URL}/api/comments/book/${bookId}`
        );
        const data = await res.json();
        if (mounted) setComments(data.comments || []);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    }

    Promise.all([loadReviews(), loadComments()]).then(() => {
      if (mounted) setLoading(false);
    });

    return () => { mounted = false };
  }, [bookId]);

  const combined = [
    ...reviewFeedback.map(r => ({
      _id: r._id,
      user: r.user_id,
      content: r.feedbackText,
      createdAt: r.createdAt
    })),
    ...comments.map(c => ({
      _id: c._id,
      user: c.user,
      content: c.content,
      createdAt: c.createdAt
    }))
  ];

  combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">

        <div className="review-modal-header">
          <h3>Book Comments</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="review-modal-body">
          {loading ? (
            <p>Loading...</p>
          ) : combined.length === 0 ? (
            <p className="no-reviews">No comments yet</p>
          ) : (
            combined.map((c) => (
              <div className="review-item" key={c._id}>

                <div className="review-user">
                  <img
                    src={
                      getAvatarUrl(c.user?.avatarUrl) ||
                      "/default-avatar.png"
                    }
                    className="review-avatar"
                  />
                  <div className="review-user-info">
                    <strong>{c.user?.displayname || "Unknown user"}</strong>
                  </div>
                </div>

                <p className="review-text">{c.content}</p>

                <span className="review-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
