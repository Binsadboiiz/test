import jwt from 'jsonwebtoken';
import ErrorApi from './handleError.js';

// Lấy secret key từ file .env
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next(new ErrorApi("You are not authenticated!", 401));
    }

    const token = authHeader.split(" ")[1]; 

    if (!token) {
        return next(new ErrorApi("Token format is invalid", 403));  
    }

    // Dùng key từ .env để giải mã
    jwt.verify(token, JWT_SECRET, (err, userDecoded) => {
        if (err) {
            return next(new ErrorApi("Token is not valid or expired!", 403));
        }
        req.user = userDecoded;
        next();
    });
};