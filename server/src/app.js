import express from "express";
import cors from "cors";

import prisma from "./lib/prisma.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

app.use(errorHandler);

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default app;
