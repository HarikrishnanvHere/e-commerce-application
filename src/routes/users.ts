import { Router } from "express";
import authMiddleWare from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users";

const userRoutes: Router = Router();

userRoutes.post("/", authMiddleWare, errorHandler(addAddress));

userRoutes.delete("/:id", authMiddleWare, errorHandler(deleteAddress));

userRoutes.get("/", authMiddleWare, errorHandler(listAddress));

userRoutes.put("/", authMiddleWare, errorHandler(updateUser));

export default userRoutes;
