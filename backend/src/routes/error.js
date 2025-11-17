import ErrorApi from "../middlewares/handleError.js";

const notFound = (req, res, next) => {
    const error = new ErrorApi(`API not found!`, 404);
    next(error);
}

const handleError = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    })
}
export { notFound, handleError };