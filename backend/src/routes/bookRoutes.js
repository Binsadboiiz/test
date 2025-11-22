import express from 'express';
import { getAllBooks,
        getBookById,
        createBook,
        editBook,
        deleteBook,
        getBookWithPagination
 } from '../controllers/bookController.js';

 const routerBook = express.Router();

 routerBook.post('/', createBook);
 routerBook.get('/', getAllBooks);
 routerBook.get('/filter', getBookWithPagination);
 routerBook.get('/:id', getBookById);
 routerBook.put('/:id', editBook);
 routerBook.delete('/:id', deleteBook);

 export default routerBook;