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

/**
 * @openapi
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     description: Retrieves all budgets belonging to the authenticated user. Results can be filtered by month and year.
 *     tags:
 *       - Budgets
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Budgets retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", checkAuth, getBudgets);

router.get("/summary", checkAuth, getBudgetSummary);

/**
 * @openapi
 * /budgets:
 *   post:
 *     summary: Create a budget
 *     description: Creates a monthly expense budget for a category.
 *     tags:
 *       - Budgets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - month
 *               - year
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 20000
 *               month:
 *                 type: integer
 *                 example: 8
 *               year:
 *                 type: integer
 *                 example: 2026
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Budget created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Validation failed or category is not an expense category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       409:
 *         description: Budget already exists for the selected category, month, and year
 *       500:
 *         description: Internal server error
 */
router.post("/", checkAuth, createBudget);

/**
 * @openapi
 * /budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     description: Updates an existing monthly budget.
 *     tags:
 *       - Budgets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 25000
 *               month:
 *                 type: integer
 *                 example: 8
 *               year:
 *                 type: integer
 *                 example: 2026
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Budget updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Validation failed or category is not an expense category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget or category not found
 *       409:
 *         description: Budget already exists for the selected category, month, and year
 *       500:
 *         description: Internal server error
 */
router.put("/:id", checkAuth, updateBudget);

/**
 * @openapi
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     description: Deletes a monthly budget belonging to the authenticated user.
 *     tags:
 *       - Budgets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget ID.
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Budget deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", checkAuth, deleteBudget);

export default router;
