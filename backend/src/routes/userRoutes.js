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
    resetPassword
 } from '../controllers/userController.js';
 import authMiddleware from "../middlewares/authMiddleware.js";


 const routerUser = express.Router();

 routerUser.post('/forgot-password', forgotPassword);
 routerUser.post('/reset-password', resetPassword);

 routerUser.post('/register', registerUser);
 routerUser.post('/login', loginUser);
 routerUser.post('logout', logoutUser);
 

 routerUser.get('/', getAllUsers);
 routerUser.get('/my-favorite-books', authMiddleware, getMyFavoriteBooks);

 routerUser.get('/:id', getUserById);
 routerUser.put('/:id', editUser);
 routerUser.delete('/:id', deleteUser);

 export default routerUser;