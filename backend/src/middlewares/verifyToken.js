import jwt from 'jsonwebtoken';
import ErrorApi from './handleError.js';

// Secret Key: Nên để trong file .env (ví dụ: process.env.JWT_SECRET)
// Ở đây mình để tạm string cứng để bạn dễ test
const JWT_SECRET = process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_ban';

export const verifyToken = (req, res, next) => {
    // 1. Lấy token từ header
    // Chuẩn format header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next(new ErrorApi("You are not authenticated! No token provided.", 401));
    }

    // Tách chữ "Bearer " ra để lấy token
    // Nếu client chỉ gửi token không có chữ Bearer thì sửa thành: const token = authHeader;
    const token = authHeader.split(" ")[1]; 

    if (!token) {
        return next(new ErrorApi("Token format is invalid", 403));
    }

    // 2. Xác thực token
    jwt.verify(token, JWT_SECRET, (err, userDecoded) => {
        if (err) {
            // Token hết hạn hoặc sai
            return next(new ErrorApi("Token is not valid or expired!", 403));
        }

        // 3. Gán thông tin giải mã được vào req.user
        // userDecoded thường chứa { _id: '...', roles: ['...'], iat: ..., exp: ... }
        req.user = userDecoded;
        
        // Cho phép đi tiếp sang Controller
        next();
    });
};

// (Tùy chọn) Middleware chỉ cho phép Admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.roles.includes('admin')) {
            next();
        } else {
            return next(new ErrorApi("You are not allowed to do that! Admin only.", 403));
        }
    });
};