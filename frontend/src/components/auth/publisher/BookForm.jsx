import { useState } from "react";
import "../../../styles/bookForm.css"

export default function BookForm({ book, onClose }) {
  const [form, setForm] = useState({
    bookTitle: book?.bookTitle || "",
    bookAuthor: book?.bookAuthor || "",
    bookDescription: book?.bookDescription || "",
    bookPublicationYear: book?.bookPublicationYear || new Date().getFullYear(),
    bookGenre: (book?.bookGenre || []).join(", "),
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(book);

  function handleChange(e) { setForm(prev=>({...prev, [e.target.name]: e.target.value})); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("bookTitle", form.bookTitle);
      payload.append("bookAuthor", form.bookAuthor);
      payload.append("bookDescription", form.bookDescription);
      payload.append("bookPublicationYear", form.bookPublicationYear);
      payload.append("bookGenre", form.bookGenre.split(",").map(s=>s.trim()));

      if (thumbnail) payload.append("thumbnail", thumbnail);
      if (bookFile) payload.append("bookFile", bookFile);

      const url = isEdit ? `http://localhost:3000/api/books/${book._id}` : "http://localhost:3000/api/books";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: payload
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="book-form-modal">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Title<input name="bookTitle" value={form.bookTitle} onChange={handleChange} required/></label>
        <label>Author<input name="bookAuthor" value={form.bookAuthor} onChange={handleChange} required/></label>
        <label>Year<input name="bookPublicationYear" value={form.bookPublicationYear} onChange={handleChange} type="number" required/></label>
        <label>Genre (comma separated)<input name="bookGenre" value={form.bookGenre} onChange={handleChange} /></label>
        <label>Description<textarea name="bookDescription" value={form.bookDescription} onChange={handleChange} /></label>

        <label>Thumbnail<input type="file" accept="image/*" onChange={e=>setThumbnail(e.target.files[0])} /></label>
        <label>Book file (pdf/epub)<input type="file" accept=".pdf,.epub" onChange={e=>setBookFile(e.target.files[0])} /></label>

        <div className="actions">
          <button type="submit" disabled={loading}>{loading ? "Saving..." : (isEdit ? "Save" : "Create")}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
