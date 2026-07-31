import { Router } from "express";
import {
  getExpenseByCategory,
  getIncomeByCategory,
  getMonthlyExpenseTrend,
  getMonthlyIncomeTrend,
} from "../handlers/analytics_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/expenses/category", checkAuth, getExpenseByCategory);
router.get("/income/category", checkAuth, getIncomeByCategory);
router.get("/expenses/monthly", checkAuth, getMonthlyExpenseTrend);
router.get("/income/monthly", checkAuth, getMonthlyIncomeTrend);

export default router;
