import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import uploadAvatar from '../config/updateAvatar.js';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';

const routerProfile = express.Router();


routerProfile.get('/me', authMiddleware, getProfile);
routerProfile.put('/me', authMiddleware, uploadAvatar.single("avatar"), updateProfile);
routerProfile.put('/me/change-password', authMiddleware, changePassword);

export default routerProfile;