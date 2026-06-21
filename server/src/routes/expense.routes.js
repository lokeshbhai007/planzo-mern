import { Router } from "express";
import {
  getAllExpenses
} from "../controllers/expense.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getAllExpenses);


export default router;