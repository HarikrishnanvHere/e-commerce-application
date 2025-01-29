import { Router } from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import { errorHandler } from "../error-handler";
import authMiddleWare from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post("/", [authMiddleWare, adminMiddleWare], errorHandler(createProduct));

productsRoutes.put("/:id", [authMiddleWare, adminMiddleWare], errorHandler(updateProduct));

productsRoutes.delete("/:id", [authMiddleWare, adminMiddleWare], errorHandler(deleteProduct));

productsRoutes.get("/", [authMiddleWare, adminMiddleWare], errorHandler(listProducts));

productsRoutes.get("/:id", [authMiddleWare, adminMiddleWare], errorHandler(getProductById));

export default productsRoutes;
