import express from 'express';
import { getAllBooks,
        getBookById,
        createBook,
        editBook,
        deleteBook,
        getBookWithPagination,
        getTopRateBooks
 } from '../controllers/bookController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadFields } from '../config/uploadImg.js';

 const routerBook = express.Router();

 routerBook.post('/', authMiddleware, uploadFields, createBook);
 routerBook.get('/', getAllBooks);
 routerBook.get('/filter', getBookWithPagination);
 routerBook.get('/top-rate', getTopRateBooks);
 routerBook.get('/:id', getBookById);
 routerBook.put('/:id', authMiddleware, uploadFields, editBook);
 routerBook.delete('/:id', authMiddleware, deleteBook);

 export default routerBook;