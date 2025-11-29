import ErrorApi from "./handleError.js";

export default function adminMiddleware(req, res, next) {
  try {
    if (!req.user) {
      // Nếu user chưa login
      return next(new ErrorApi("Not authenticated", 401));
    }

    if (!req.user.roles.includes("admin")) {
      // Nếu không phải admin
      return next(new ErrorApi("Access denied: Admins only", 403));
    }

    // Nếu là admin thì hoạt động
    next();
  } catch (err) {
    next(err);
  }
}
