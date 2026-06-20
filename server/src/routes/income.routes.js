import { Router } from "express";
import {
  getIncomes,
  createIncome,
  deleteIncome,
} from "../controllers/income.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getIncomes);
router.post("/", createIncome); 
router.delete("/:id", deleteIncome);

export default router;