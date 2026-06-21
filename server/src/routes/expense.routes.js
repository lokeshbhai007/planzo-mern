import { Router } from "express";
import {
  getAllExpenses,
  getExpensesByBudget,
  createExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getAllExpenses);
router.get("/:budgetId", getExpensesByBudget);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);

export default router;