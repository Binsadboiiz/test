import express from "express";
import { createBook, deleteBook } from "../controllers/bookController.js";
import { registerPublisher, getPublisherById } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const routerPublisher = express.Router();


routerPublisher.post("/books", authMiddleware, createBook);

routerPublisher.post("/register", registerPublisher);
routerPublisher.delete("/books/:bookId", authMiddleware,  deleteBook);
routerPublisher.get("/:id", getPublisherById);

export default routerPublisher;
