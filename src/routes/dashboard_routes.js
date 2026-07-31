import { Router } from "express";
import {
  getDashboardSummary,
  getRecentTransactions,
} from "../handlers/dashboard_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/summary", checkAuth, getDashboardSummary);
router.get("/recent", checkAuth, getRecentTransactions);

export default router;
