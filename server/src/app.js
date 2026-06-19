import express from "express";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import prisma from "./lib/prisma.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());
app.use(morgan("dev"));



app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use(errorHandler);

export default app;
