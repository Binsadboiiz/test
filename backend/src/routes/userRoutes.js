import express from 'express';
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser
 } from '../controllers/userController.js';

 const routerUser = express.Router();

 routerUser.post('/register', registerUser);
 routerUser.post('/login', loginUser);

 routerUser.get('/', getAllUsers);
 routerUser.get('/:id', getUserById);
 routerUser.put('/:id', editUser);
 routerUser.delete('/:id', deleteUser);

 export default routerUser;