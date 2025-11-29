import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/bookManagement.css";
import HandleErrorAPI from "../../utils/handleErrorAPI";

const API_URL = import.meta.env.VITE_API_URL;

function Modal({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="bm-modal-backdrop">
      <div className="bm-modal">
        <div className="bm-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="bm-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [form, setForm] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookDescription: "",
    bookPublicationYear: "",
    bookGenre: "",
    thumbnailUrl: "",
    publisher_id: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const loadBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/books/filter?page=${page}&limit=${limit}&search=${query}`
      );

      const text = await res.text();

      if (!res.ok) {
        console.error("Server error:", text);
        throw new Error("Failed to load books");
      }

      const data = JSON.parse(text);

      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      HandleErrorAPI(err, navigate, "Load books failed");
    } finally {
      setLoading(false);
    }
  };

  const loadPublishers = async () => {
    try {
      const res = await fetch(`${API_URL}/publisher`);
      if (!res.ok) return;

      const data = await res.json();
      setPublishers(data);
    } catch (err) {
        HandleErrorAPI(err, navigate, "loadPublisher.bookManagement")
    }
  };

  useEffect(() => {
    loadPublishers();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [page]);


  function openCreate() {
    setSelectedBook(null);
    setForm({
      bookTitle: "",
      bookAuthor: "",
      bookDescription: "",
      bookPublicationYear: "",
      bookGenre: "",
      thumbnailUrl: "",
      publisher_id: ""
    });
    setShowForm(true);
  }

  function openEdit(book) {
    setSelectedBook(book);
    setForm({
      bookTitle: book.bookTitle,
      bookAuthor: book.bookAuthor,
      bookDescription: book.bookDescription,
      bookPublicationYear: book.bookPublicationYear,
      bookGenre: book.bookGenre,
      thumbnailUrl: book.thumbnailUrl,
      publisher_id: book?.publisher_id?._id || ""
    });
    setShowForm(true);
  }


  async function submitForm(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const payload = { ...form };

      const res = await fetch(
        selectedBook ? `${API_URL}/books/${selectedBook._id}` : `/books`,
        {
          method: selectedBook ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        console.error(text);
        throw new Error("Save failed");
      }

      setShowForm(false);
      loadBooks();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }


  async function deleteBook(id) {
    if (!window.confirm("Xóa sách này?")) return;
    try {
      const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadBooks();
    } catch (err) {
      HandleErrorAPI(err, navigate, "Delete book failed");
    }
  }

  return (
    <div className="admin-book-management">
      <h2>Book Management</h2>

      <div className="bm-controls">
        <input
          placeholder="Search title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={openCreate}>+ Add book</button>
        <button onClick={() => loadBooks()}>Refresh</button>
      </div>

      <div className="bm-pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bm-grid">
          {books.map((b) => (
            <div className="bm-card" key={b._id}>
              <img
                src={b.thumbnailUrl || "/book-placeholder.png"}
                onError={(e) => (e.target.src = "/book-placeholder.png")}
                alt=""
                className="bm-thumb"
              />

              <h4>{b.bookTitle}</h4>
              <div className="bm-author">{b.bookAuthor}</div>
              <div className="bm-year">{b.bookPublicationYear}</div>
              <div className="bm-publisher">
                {b.publisher_id?.pubName || "—"}
              </div>

              <div className="bm-card-actions">
                <button className="bm-btn bm-edit" onClick={() => openEdit(b)}>
                  Edit
                </button>
                <button
                  className="bm-btn bm-delete"
                  onClick={() => deleteBook(b._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showForm}
        title={selectedBook ? "Edit Book" : "Add Book"}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={submitForm} className="bm-form">
          <label>
            Title
            <input
              value={form.bookTitle}
              onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
              required
            />
          </label>

          <label>
            Author
            <input
              value={form.bookAuthor}
              onChange={(e) => setForm({ ...form, bookAuthor: e.target.value })}
            />
          </label>

          <label>
            Description
            <textarea
              value={form.bookDescription}
              onChange={(e) =>
                setForm({ ...form, bookDescription: e.target.value })
              }
              rows={3}
            />
          </label>

          <label>
            Publication Year
            <input
              type="number"
              value={form.bookPublicationYear}
              onChange={(e) =>
                setForm({ ...form, bookPublicationYear: e.target.value })
              }
            />
          </label>

          <label>
            Genre
            <input
              value={form.bookGenre}
              onChange={(e) => setForm({ ...form, bookGenre: e.target.value })}
            />
          </label>

          <label>
            Thumbnail URL
            <input
              value={form.thumbnailUrl}
              onChange={(e) =>
                setForm({ ...form, thumbnailUrl: e.target.value })
              }
            />
          </label>

          <label>
            Publisher
            <select
              value={form.publisher_id}
              onChange={(e) =>
                setForm({ ...form, publisher_id: e.target.value })
              }
            >
              <option value="">— Select publisher —</option>
              {publishers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.pubName}
                </option>
              ))}
            </select>
          </label>

          {errorMsg && <div className="bm-error">{errorMsg}</div>}

          <div className="bm-form-actions">
            <button type="submit" className="bm-save-btn">
              Save
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
