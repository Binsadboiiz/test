import express from "express";
import {
    addReview,
    updateReview,
    deleteReview,
    getReviewsByBook
} from "../controllers/reviewController.js";

import verifyToken from "../middlewares/verifyToken.js";

const routerReview = express.Router();

routerReview.get("/book/:bookId", getReviewsByBook);

routerReview.post("/", verifyToken, addReview);

routerReview.put("/:id", verifyToken, updateReview);

routerReview.delete("/:id", verifyToken, deleteReview);


export default routerReview;
