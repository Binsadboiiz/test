import { useEffect, useState } from "react";
import BookForm from "../components/auth/publisher/BookForm";
import BookCard from "../components/auth/publisher/BookCard";
import "../styles/publisherBook.css";

export default function PublisherBooksPage() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadBooks() {
    const res = await fetch("http://localhost:3000/api/books?publisherId=me", {
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    setBooks(data);
  }

    useEffect(() => {
    let mounted = true;
    async function loadBooks() {
        try {
        const res = await fetch("http://localhost:3000/api/books", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("Load books fail", res.status);
            return;
        }
        const data = await res.json();
        if (!mounted) return;
        setBooks(data);
        } catch (err) {
        console.error("loadBooks err", err);
        }
    }

    loadBooks();

    return () => {
        mounted = false;
    };
    }, []);

  return (
    <div className="pub-books-page">
      <div className="pub-books-header">
        <h2>My Books</h2>
        <button onClick={()=>{ setEditing(null); setShowForm(true); }}>+ Add book</button>
      </div>

      <div className="pub-books-grid">
        {books.map(b => (
          <BookCard key={b._id} book={b} onEdit={(bk)=>{ setEditing(bk); setShowForm(true); }} onDeleted={loadBooks} />
        ))}
      </div>

      {showForm && <BookForm book={editing} onClose={()=>{ setShowForm(false); loadBooks(); }} />}
    </div>
  );
}
