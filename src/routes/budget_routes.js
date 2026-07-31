import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  getBudgetSummary,
  updateBudget,
} from "../handlers/budget_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/", checkAuth, getBudgets);
router.get("/summary", checkAuth, getBudgetSummary);
router.post("/", checkAuth, createBudget);
router.put("/:id", checkAuth, updateBudget);
router.delete("/:id", checkAuth, deleteBudget);

export default router;
