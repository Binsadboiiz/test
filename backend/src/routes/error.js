import ErrorApi from "../middlewares/handleError.js";

export const notFound = (req, res, next) => {
    const error = new ErrorApi(`API not found!`, 404);
    next(error);
}

export const handleError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    })
}
