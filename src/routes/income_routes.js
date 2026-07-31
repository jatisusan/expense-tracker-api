import { Router } from "express";
import {
  createIncome,
  deleteIncome,
  getAllIncome,
  getIncomeById,
  updateIncome,
} from "../handlers/income_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/", checkAuth, getAllIncome);
router.post("/", checkAuth, createIncome);
router.get("/:id", checkAuth, getIncomeById);
router.put("/:id", checkAuth, updateIncome);
router.delete("/:id", checkAuth, deleteIncome);

export default router;
