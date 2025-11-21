import express from 'express';
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
    logoutUser
 } from '../controllers/userController.js';

 const routerUser = express.Router();

 routerUser.post('/register', registerUser);
 routerUser.post('/login', loginUser);
 routerUser.post('logout', logoutUser)

 routerUser.get('/', getAllUsers);
 routerUser.get('/:id', getUserById);
 routerUser.put('/:id', editUser);
 routerUser.delete('/:id', deleteUser);

 export default routerUser;