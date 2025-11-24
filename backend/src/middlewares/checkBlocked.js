import User from '../models/users.js';
import ErrorApi from './handleError.js';

export default async function checkNotBloacked(req, res, next) {
    try {
        const userId = req.user?._id;

        if(!userId) throw new ErrorApi("Unauthorized", 401);

        const user = await User.findById(userId).select("isBlocked");
        if(!user) throw new ErrorApi("User not found", 404);
        if(user.isBlocked) throw new ErrorApi("Account is blocked", 403);

        next();
    } catch (error) {
        next(error);
    }
}