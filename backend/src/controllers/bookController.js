import bcrypt from 'bcrypt';
import Book from '../models/books.js';
import Publisher from '../models/publisher.js';
import ErrorApi from '../middlewares/handleError.js';

export async function createBook(req, res, next) {
    try {
        const {bookTitle, bookAuthor, bookDescription, bookPublicationYear, bookGenre, thumbnailUrl, publisher_id} = req.body;
        if(!bookTitle || !bookAuthor || !bookPublicationYear || !publisher_id) 
            throw new ErrorApi("Missing required fields", 400);

        const newBook = await Book.create({
            bookTitle,
            bookAuthor,
            bookDescription,
            bookPublicationYear,
            bookGenre,
            thumbnailUrl,
            publisher_id
        });
        res.status(201).json({message: "Book created successfully", newBook});
    } catch (error) {
        next(error);
    }
};

export async function getAllBooks(req, res, next) {
    try {
        const books = await Book.find().populate('publisher_id', 'pubName pubEmail pubDescription');
        res.status(200).json(books);
    } catch (error) {
        next(error);
    } 
};

export async function getBookById(req, res, next) {
    try {
        const book = await Book.findById(req.params.id).populate('publisher_id', 'pubName pubEmail pubDescription');
        if (!book) throw new ErrorApi('Book not found', 404);
        res.json(book);
    } catch (error) {
        next(error);
    }
};

export async function editBook(req, res, next) {
    try {
        const { id } = req.params;
        const {
            bookTitle,
            bookAuthor,
            bookDescription,
            bookPublicationYear,
            bookGenre,
            thumbnailUrl,
            publisher_id
        } = req.body;
        const book = await Book.findById(id);
        if(!book) throw new ErrorApi('Book not found', 404);
        if(bookTitle !== undefined ) book.bookTitle = bookTitle;
        if(bookAuthor !== undefined ) book.bookAuthor = bookAuthor;
        if(bookDescription !== undefined ) book.bookDescription = bookDescription;
        if(bookPublicationYear !== undefined ) book.bookPublicationYear = bookPublicationYear;
        if(bookGenre !== undefined ) book.bookGenre = bookGenre;
        if(thumbnailUrl !== undefined ) book.thumbnailUrl = thumbnailUrl;
        if(publisher_id !== undefined ) book.publisher_id = publisher_id;

        await book.save();

        res.json({
            message: "Edit Book Succesfully",
            book: {
                bookTitle: book.bookTitle,
                bookAuthor: book.bookAuthor,
                bookDescription: book.bookDescription,
                bookPublicationYear: book.bookPublicationYear,
                bookGenre: book.bookGenre,
                thumbnailUrl: book.thumbnailUrl,
                publisher_id: book.publisher_id,
                averageRating: book.averageRating,
                numOfReviews: book.numOfReviews
            }
        })

    } catch (error) { 
        next(error);
    }
};
 
export async function deleteBook(req, res, next) {
    try {
        const { id } = req.params;

        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) throw new ErrorApi("Book not found", 404);

        res.json({message: "Delete book successfully"})
    } catch (error) {
        next(error);
    }
};

export async function searchBooks(req, res, next) {
    try {
        const { q, genre, year, minRating } = req.query;

        let query = {};

        // 1. Tìm theo Từ khóa (Tên sách hoặc Tác giả)
        if (q) {
            query.$or = [
                { bookTitle: { $regex: q, $options: 'i' } }, // 'i' = không phân biệt hoa thường
                { bookAuthor: { $regex: q, $options: 'i' } }
            ];
        }

        // 2. Lọc theo Thể loại
        if (genre) {
            // Giả sử bookGenre là mảng, $in tìm xem genre có nằm trong mảng đó ko
            query.bookGenre = { $in: [genre] };
        }

        // 3. Lọc theo Năm xuất bản
        if (year) {
            query.bookPublicationYear = Number(year);
        }

        // 4. Lọc theo Đánh giá (ví dụ: sách trên 4 sao)
        if (minRating) {
            query.averageRating = { $gte: Number(minRating) };
        }

        const books = await Book.find(query)
            .populate('publisher_id', 'pubName')
            .sort({ createdAt: -1 }); // Kết quả mới nhất lên đầu

        res.json({
            count: books.length,
            results: books
        });
    } catch (error) {
        next(error);
    }
};

export async function getBookWithPagination(req, res, next) {
    try {
        let {
            page = 1,
            limit = 12,
            search = "all",
            genre = "all",
            year,
            minRating
        } = req.body;

        page = Number(page) || 1;
        limit = Number(limit) || 12;

        if(page < 1) page = 1
        if(limit < 1) limit = 12;

        const skip = (page - 1) * limit;

        const filter = {};

        if(search && search.trim() !== "") {
            const keyword = search.trim();
            filter.$or = [
                {bookTitle: {$regex: keyword, $options: "i"}},
                {bookAuthor: {$regex: keyword, $options: "i"}}
            ]
        };

        if(genre && genre !== "all") {
            filter.bookGenre = {$in: [new RegExp(`^${genre}$`, "i")]};
        };

        if(year) {
            filter.bookPublicationYear = Number(year);
        }

        if(minRating) {
            filter.averageRating = {$gte: Number(minRating)};
        }

        // query song song

        const [books, totalItems, genres] = await Promise.all([
            Book.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({createdAt: -1})
                .populate("publisher_id", "pubName pubDescription"),

                Book.countDocuments(filter),
                Book.distinct("bookGenre")
        ]);

        const cleanGenres = (genres || []).filter(g=> g && g.trim() !== "");
        const totalPages = Math.max(1, Math.ceil(totalItems / limit) || 1);

        res.status(200).json({
            ooks,
            totalItems,
            totalPages,
            currentPage: page,
            limit,
            genres: cleanGenres
        });
    } catch (error) {
        next(error);
    }
}
