import express from "express";
import { createBook, deleteBook } from "../controllers/bookController.js";
import { registerPublisher, getPublisherById } from "../controllers/adminController.js";
import { sendRequest } from "../controllers/publisherRequestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const routerPublisher = express.Router();

//user gửi yêu cầu trở thành publisher
routerPublisher.post("/request", authMiddleware, sendRequest);

routerPublisher.post("/books", authMiddleware, createBook);
routerPublisher.post("/register", registerPublisher);
routerPublisher.delete("/books/:bookId", authMiddleware,  deleteBook);
routerPublisher.get("/:id", getPublisherById);

export default routerPublisher;
