import jwt from 'jsonwebtoken';
import ErrorApi from '../middlewares/handleError.js';


export default function authMiddleware(req, res, next) {
    try {
        let token;

        if(req.cookie && req.cookie.token) {
            token = req.cookie.token;
        }

        if(!token) {
            const authHeader = req.headers.authorization;
            if(authHeader && authHeader.startsWith("Bearer")) {
                token = authHeader.split(" ")[1]
            }
        }

        if(!token) throw new ErrorApi("Missing authentication token", 401);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded._id,
            username: decoded.username,
            displayname: decoded.displayname,
            roles: decoded.roles
        }
        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
            return next(new ErrorApi("Invalid token", 401));
        next(error);
    }
}