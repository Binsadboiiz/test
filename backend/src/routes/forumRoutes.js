import express from "express";
import { addReply, createThread, deleteThread, getThreadDetails, getThreads } from "../controllers/forumController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkNotBloacked from "../middlewares/checkBlocked.js";

const routerForum = express.Router();

routerForum.get('/', getThreads);

routerForum.post('/', authMiddleware,  checkNotBloacked, createThread);

routerForum.get('/:id', getThreadDetails);
routerForum.post('/:id/replies', authMiddleware, checkNotBloacked ,addReply);
routerForum.delete('/:id', authMiddleware, checkNotBloacked , deleteThread);

export default routerForum;