import { Router } from "express";

import authRoutes from "./auth";
import productsRoutes from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./order";
import requestRouter from "./request";
const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/address", userRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/order", orderRoutes);
rootRouter.use("/request", requestRouter);

export default rootRouter;
