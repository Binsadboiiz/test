import jwt from 'jsonwebtoken';
import ErrorApi from '../middlewares/handleError.js';


export default function authMiddleware(req, res, next) {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if(authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split("")[1];
        }

        if(!token) {
            throw new ErrorApi("Missing authentication token", 401);
        }

        const secret = process.env.JWT_SECRET || "dev_secret_change_me";
        const decoded = jwt.verify(token, secret);

        req.user = {
            _id: decoded._id,
            username: decoded.username,
            displayname: decoded.displayname,
            roles: decoded.roles || []
        };
        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
            return next(new ErrorApi("Invalid token", 401));
        next(error);
    }
}