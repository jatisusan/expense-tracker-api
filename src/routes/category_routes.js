import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../handlers/category_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

router.get("/", checkAuth, getCategories);
router.post("/", checkAuth, createCategory);
router.put("/:id", checkAuth, updateCategory);
router.delete("/:id", checkAuth, deleteCategory);

export default router;
