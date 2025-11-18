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
        res.staus(201).json({message: "Book created successfully", newBook});
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
                publisher_id: book.publisher_id
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