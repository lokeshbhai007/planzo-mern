import { Router } from "express";
import { getAdvice } from "../controllers/ai.controller.js";
import requireAuth from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.post("/advice", getAdvice);

export default router;