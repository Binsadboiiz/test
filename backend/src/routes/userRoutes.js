import express from 'express';
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
    logoutUser,
    getMyFavoriteBooks
 } from '../controllers/userController.js';
 import authMiddleware from "../middlewares/authMiddleware.js";


 const routerUser = express.Router();

 routerUser.post('/register', registerUser);
 routerUser.post('/login', loginUser);
 routerUser.post('logout', logoutUser)

 routerUser.get('/', getAllUsers);
 routerUser.get('/:id', getUserById);
 routerUser.get('/my-favorite-books', authMiddleware, getMyFavoriteBooks);
 routerUser.put('/:id', editUser);
 routerUser.delete('/:id', deleteUser);

 export default routerUser;