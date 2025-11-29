import { rejects } from "assert";
import express from "express";
import { getRequests, approveRequest, rejectRequest } from "../controllers/adminController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const routerAdmin = express.Router();

//admin xem yêu cầu publisher
routerAdmin.get("/publisher/requests", adminMiddleware, getRequests);

//admin duyệt yêu cầu
routerAdmin.put("/publisher/request/:id/approve", adminMiddleware, approveRequest);

//admin từ chối 
routerAdmin.put("/publisher/request/:id/reject", adminMiddleware, rejectRequest);

export default routerAdmin;
