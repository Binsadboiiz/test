import { useEffect, useState } from "react";
import HandleErrorAPI from "../utils/handleErrorAPI";
import { useNavigate } from "react-router-dom";
import "../styles/listbook.css";

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const LIMIT = 12;
    const [search, setSearch] = useState("");
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState("all");
    const [years, setYears] = useState([]);
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);

    //gọi API lấy sách
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            params.append("page", currentPage);
            params.append("limit", LIMIT);
            if (search.trim()) params.append("search", search.trim());
            if (genre !== "all") params.append("genre", genre);
            if(year) params.append("year", year);

            const res = await fetch(`http://localhost:3000/api/books?${params.toString()}`);
            const data = await res.json();

            if(Array.isArray(data.genres)) {
                setGenres(data.genres);
            }
            if(Array.isArray(data.years)) {
                setYears(data.years)
            }

            setBooks(data.books || []);
            setTotalPages(data.totalPages || 1)
        } catch (error) {
            HandleErrorAPI(error, navigate, "BôkList");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [currentPage, search, genre])


    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleGenreChange = (e) => {
        setGenre(e.target.value);
        setCurrentPage(1);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            {/* Thanh filter + search */}
            <div className="nav-fields">
                <div className="nav-filter">
                    <select value={genre} onChange={handleGenreChange}>
                         <option value="all">All genres</option>
                         {genres.map((g)=> (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <select value={year} onChange={handleYearChange}>
                         <option value="all">Year</option>
                         {years.map((y)=> (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="nav-search">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="searching..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>

            {/* Danh sách sách */}
            <div className="book-list">
                {loading && <div className="loading">Loading...</div>}

                {!loading && books.length === 0 && (
                    <div className="no-book">Không tìm thấy sách nào</div>
                )}

                <div className="book-container">
                    {books.map((book) => (
                        <div className="book-card" key={book._id || book.id}>
                            <div className="book-cover">
                                <img src={book.coverUrl} alt={book.title} />
                            </div>
                            <div className="book-info">
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">{book.author}</p>
                                <p className="book-genre">{book.genre}</p>
                                {/* thêm rating / price / nút xem chi tiết */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    Prev
                </button>

                <span className="page-info">
                    Page {currentPage} / {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </>
    );
}
