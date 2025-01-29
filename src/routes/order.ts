import { Router } from "express";
import authMiddleWare from "../middlewares/auth";
import { createOrder, getOrders, updateOrder } from "../controllers/order";
const orderRoutes = Router();

orderRoutes.get("/", authMiddleWare, createOrder);
orderRoutes.post("/", authMiddleWare, updateOrder);
orderRoutes.get("/get", authMiddleWare, getOrders);

export default orderRoutes;
