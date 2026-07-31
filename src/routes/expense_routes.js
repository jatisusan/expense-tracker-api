import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
} from "../handlers/expense_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/", checkAuth, getExpenses);
router.post("/", checkAuth, createExpense);
router.get("/:id", checkAuth, getExpenseById);
router.put("/:id", checkAuth, updateExpense);
router.delete("/:id", checkAuth, deleteExpense);

export default router;
