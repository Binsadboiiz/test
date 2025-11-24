// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import ErrorApi from "./handleError.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new ErrorApi("Not authenticated", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password -passwordOld");
    if (!user) {
      throw new ErrorApi("User not found", 404);
    }

    req.user = user;
    next();
  } catch (err) {
    // lỗi token
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ErrorApi("Invalid or expired token", 401));
    }
    next(err);
  }
}
