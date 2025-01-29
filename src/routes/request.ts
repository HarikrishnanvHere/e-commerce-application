import { Router } from "express";
import { resetPassword, sendMail, sendUI } from "../controllers/request";

const requestRouter = Router();

requestRouter.post("/", sendMail);
requestRouter.get("/:id", sendUI);
requestRouter.get("/update/:id", resetPassword);

export default requestRouter;
