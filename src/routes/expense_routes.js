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

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: Get all expense transactions
 *     description: Retrieves all expense transactions belonging to the authenticated user with pagination, filtering, searching, and sorting.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: walletId
 *         schema:
 *           type: integer
 *         description: Filter by wallet ID
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Minimum expense amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Maximum expense amount
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - amount
 *             - date
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Expense transactions retrieved successfully
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
 *                   example: Expenses retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
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
router.get("/", checkAuth, getExpenses);

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create an expense transaction
 *     description: Creates a new expense transaction and deducts the amount from the associated wallet.
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - date
 *               - walletId
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery Shopping
 *               amount:
 *                 type: number
 *                 example: 2500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-01
 *               description:
 *                 type: string
 *                 example: Weekly groceries
 *               walletId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Expense created successfully
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
 *                   example: Expense created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Validation failed or insufficient wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ConflictError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet or expense category not found
 *       500:
 *         description: Internal server error
 */
router.post("/", checkAuth, createExpense);

/**
 * @openapi
 * /expenses/{id}:
 *   get:
 *     summary: Get an expense transaction
 *     description: Retrieves an expense transaction belonging to the authenticated user by its ID.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Expense ID.
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
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
 *                   example: Expense retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", checkAuth, getExpenseById);

/**
 * @openapi
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense transaction
 *     description: Updates an existing expense transaction and adjusts wallet balances if necessary.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Expense ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery Shopping
 *               amount:
 *                 type: number
 *                 example: 3000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-01
 *               description:
 *                 type: string
 *                 example: Updated grocery expenses
 *               walletId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Expense updated successfully
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
 *                   example: Expense updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Validation failed or insufficient wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ConflictError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense, wallet, or expense category not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", checkAuth, updateExpense);

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense transaction
 *     description: Deletes an expense transaction and restores the associated wallet balance.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Expense ID.
 *     responses:
 *       200:
 *         description: Expense deleted successfully
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
 *                   example: Expense deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", checkAuth, deleteExpense);

export default router;
