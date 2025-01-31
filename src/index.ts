import express, { Application } from "express";
export const app: Application = express();
app.use(express.json());

import { PrismaClient } from "@prisma/client";
export const prismaClient = new PrismaClient({
  log: ["query"],
});

import { PORT } from "./secret";
import { errorMiddleware } from "./middlewares/error";
import routes from "./routes";

app.use("/api", routes);

app.use(errorMiddleware);

export const server = app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
