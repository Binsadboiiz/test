import { useState } from "react";
import BookReviews from "../publisher/BookReview";
import "../../../styles/bookCard.css"

const API_URL = import.meta.env.VITE_API_URL;

export default function BookCard({ book, onEdit, onDeleted }) {
    const [reviewsOpen, setReviewsOpen] = useState(false);

  async function handleDelete() {
    if (!confirm("Xác nhận xóa sách này?")) return;
    const res = await fetch(`${API_URL}/api/books/${book._id}`, {
      method: "DELETE", credentials: "include"
    });
    if (!res.ok) { const d = await res.json().catch(()=>null); alert(d?.message || "Delete failed"); return; }
    onDeleted();
  }

  return (
    <div className="book-body">
  <img src={book.thumbnailUrl} alt={book.bookTitle} />
  <h3 className="book-title">{book.bookTitle}</h3>
  <p className="book-author">{book.bookAuthor}</p>

  <div className="book-rating">
    ⭐ {book.averageRating?.toFixed(1) || 0} 
    <span className="rating-count">({book.numOfReviews || 0} reviews)</span>
  </div>

  <div className="book-actions">
    <button className="btn btn--primary" onClick={() => onEdit(book)}>Edit</button>
    <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
    <button className="btn btn--muted" onClick={() => setReviewsOpen(true)}>Reviews</button>
  </div>

  {reviewsOpen && (
    <BookReviews bookId={book._id} onClose={() => setReviewsOpen(false)} />
  )}
</div>

  )
}
