import express from "express";
import { getCommentsByBook, createComment, deleteComment } from "../controllers/commentController.js";
import authMiddleware  from "../middlewares/authMiddleware.js";

const routerComment = express.Router();

routerComment.post("/", authMiddleware, createComment);
routerComment.get("/book/:bookId", getCommentsByBook);
routerComment.delete("/:id", authMiddleware, deleteComment);

export default routerComment;
