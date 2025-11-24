import express from "express";
import {
    addReview,
    updateReview,
    deleteReview,
    getReviewsByBook
} from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const routerReview = express.Router();


routerReview.post("/", authMiddleware, addReview);

routerReview.get("/book/:bookId", getReviewsByBook);

routerReview.put("/:id", authMiddleware , updateReview);

routerReview.delete("/:id", authMiddleware, deleteReview);


export default routerReview;
