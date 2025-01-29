import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleWare from "../middlewares/auth";
import { addItemToCart, deleteItemFromCart, updateQuantity, getCart } from "../controllers/cart";

export const cartRoutes: Router = Router();

cartRoutes.post("/", authMiddleWare, errorHandler(addItemToCart));
cartRoutes.delete("/:id", authMiddleWare, errorHandler(deleteItemFromCart));
cartRoutes.put("/:id", authMiddleWare, errorHandler(updateQuantity));
cartRoutes.get("/", authMiddleWare, errorHandler(getCart));

export default cartRoutes;
