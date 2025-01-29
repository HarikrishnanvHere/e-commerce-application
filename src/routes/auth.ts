import { Router } from "express";
import { signup, login } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleWare from "../middlewares/auth";
import { me } from "../controllers/auth";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/login", errorHandler(login));
authRouter.get("/me", [authMiddleWare], errorHandler(me));

export default authRouter;
