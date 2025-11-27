import express from 'express';
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
    logoutUser,
    getMyFavoriteBooks,
    forgotPassword,
    resetPassword,
    addFavoriteBook,
    removeFavoriteBook,
    blockUser
 } from '../controllers/userController.js';
 import authMiddleware from "../middlewares/authMiddleware.js";


 const routerUser = express.Router();
 

 routerUser.post('/forgot-password', forgotPassword);
 routerUser.post('/reset-password', resetPassword);

 routerUser.post('/register', registerUser);
 routerUser.post('/login', loginUser);
 routerUser.post('/logout', logoutUser);


 routerUser.get('/', getAllUsers);
 routerUser.get('/my-favorite-books', authMiddleware, getMyFavoriteBooks);

 routerUser.post('/my-favorite-books/:bookId', authMiddleware, addFavoriteBook);
 routerUser.get('/:id', getUserById);
 routerUser.put('/:id', editUser);
 routerUser.patch('/:id/block', authMiddleware, blockUser);
 routerUser.delete('/:id', deleteUser);
 routerUser.delete('/my-favorite-books/:bookId', authMiddleware, removeFavoriteBook);

 export default routerUser;