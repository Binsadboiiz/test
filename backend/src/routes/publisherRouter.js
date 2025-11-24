import express from "express";
import publisherController from "../controllers/publisherController.js";
import verifyToken from "../middlewares/verifyToken.js";

const routerPublisher = express.Router();

routerPublisher.post("/login", publisherController.loginPublisher);

routerPublisher.post("/books", verifyToken, publisherController.createBook);

routerPublisher.delete("/books/:bookId", verifyToken, publisherController.deleteBook);

routerPublisher.get("/feedback/:publisher_id", verifyToken, publisherController.getReaderFeedback);

routerPublisher.get("/stats/:publisher_id", verifyToken, publisherController.getPublisherStats);

export default routerPublisher;
