import bcrypt from 'bcrypt';
import User from '../models/users.js';
import Publisher from '../models/publisher.js';
import Book from '../models/books.js';
import Review from '../models/review.js';
import ErrorApi from '../middlewares/handleError.js';
import jwt from 'jsonwebtoken';

const loginPublisher = async (req, res, next) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            throw new ErrorApi("Please enter username/email and password", 400);
        }

        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ErrorApi("Wrong account or password", 401);
        };

        if (!user.roles.includes("publisher")) {
            throw new ErrorApi("Access denied. You are not publisher.", 403);
        }

        if (user.isBlocked) {
            throw new ErrorApi("Account is blocked", 403);
        }

        const publisherProfile = await Publisher.findOne({ pubEmail: user.email });

        if (!publisherProfile) {
            throw new ErrorApi("No Publisher profile associated with this account was found", 404);
        }

        const token = jwt.sign(
            { 
                _id: user._id, 
                roles: user.roles 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        const userResponse = {
            _id: user._id,
            publisher_id: publisherProfile._id, 
            username: user.username,
            email: user.email,
            pubName: publisherProfile.pubName,
            roles: user.roles
        };

        res.json({
            message: "Login publisher successfully",
            token,
            user: userResponse
        });
    } catch (error) {
        next(error);
    };
}

const createBook = async (req, res, next) => {
    try {
        const {
            bookTitle,
            bookAuthor,
            bookPublicationYear, 
            bookGenre, 
            bookDescription, 
            thumbnailUrl,
            publisher_id
        } = req.body

        if (!bookTitle || !bookAuthor || !bookPublicationYear || !publisher_id) {
            throw new ErrorApi("Required fields: Book Title, Author, Publication Year and Publisher ID", 400);
        }

        const publisherExists = await Publisher.findById(publisher_id);
        if (!publisherExists) {
            throw new ErrorApi("Publisher not found", 404);
        }

        const newBook = await Book.create({
            bookTitle,
            bookAuthor,
            bookPublicationYear, 
            bookGenre, 
            bookDescription, 
            thumbnailUrl,
            publisher_id
        });

        res.status(201).json({
            message: "New book published successfully",
            book: newBook
        });
    } catch (error) {
        next(error);
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { publisher_id } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            throw new ErrorApi("Book not found", 404);
        }

        if (book.publisher_id.toString() !== publisher_id) {
            throw new ErrorApi("You do not have permission to delete other Publisher's listings", 403);
        }

        await Book.findByIdAndDelete(bookId);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        next(error);
    }
}

const getReaderFeedback = async (req, res, next) => {
    try {
        const { publisher_id } = req.params;

        const books = await Book.find({ publisher_id: publisher_id }).select('_id bookTitle');

        if (books.length === 0) {
            return res.json({ message: "No books yet, no feedback yet.", reviews: [] });
        }

        const bookIds = books.map(book => book._id);
        const reviews = await Review.find({ book_id: { $in: bookIds } })
            .populate('user_id', 'displayname avatarUrl')
            .populate('book_id', 'bookTitle')
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (error) {
        next(error);
    }
}

const getPublisherStats = async (req, res, next) => {
    try {
        const { publisher_id } = req.params;
        
        const books = await Book.find({ publisher_id })
            .select('bookTitle thumbnailUrl averageRating numOfReviews')
            .sort({ averageRating: -1 });

        res.json({ stats: books });
    } catch (error) {
        next(error);
    }
};

export default {
    loginPublisher,
    createBook,
    deleteBook,
    getReaderFeedback,
    getPublisherStats
};