import express from "express";
import adminController from "../controllers/adminController.js";
import verifyToken from "../middlewares/verifyToken.js";

const routerAdmin = express.Router();
routerAdmin.post("/login", adminController.loginAdmin);

routerAdmin.post("/publisher", verifyToken, adminController.addPublisher);
routerAdmin.get("/publisher", verifyToken, adminController.getAllPublisher);
routerAdmin.put("/publisher/:id", verifyToken, adminController.updatePublisher);
routerAdmin.delete("/publisher/:id", verifyToken, adminController.deletePublisher);

routerAdmin.get("/users", verifyToken, adminController.getAllUserAdmin);
routerAdmin.put("/users/ban/:id", verifyToken, adminController.banUser);
routerAdmin.put("/users/unban/:id", verifyToken, adminController.unbanUser);

routerAdmin.get("/books", verifyToken, adminController.getAllBookAdmin);

export default routerAdmin;
