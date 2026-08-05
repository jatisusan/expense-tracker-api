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

/**
 * @openapi
 * /income:
 *   get:
 *     summary: Get all income transactions
 *     description: Retrieves all income transactions belonging to the authenticated user with pagination, filtering, searching, and sorting.
 *     tags:
 *       - Income
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
 *         description: Minimum income amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Maximum income amount
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
 *         description: Income transactions retrieved successfully
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
 *                   example: Incomes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Income'
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
router.get("/", checkAuth, getAllIncome);

/**
 * @openapi
 * /income:
 *   post:
 *     summary: Create an income transaction
 *     description: Creates a new income transaction and updates the associated wallet balance.
 *     tags:
 *       - Income
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
 *                 example: Salary
 *               amount:
 *                 type: number
 *                 example: 50000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-01
 *               description:
 *                 type: string
 *                 example: Monthly salary
 *               walletId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Income created successfully
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
 *                   example: Income created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Income'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet or income category not found
 *       500:
 *         description: Internal server error
 */
router.post("/", checkAuth, createIncome);

/**
 * @openapi
 * /income/{id}:
 *   get:
 *     summary: Get an income transaction
 *     description: Retrieves an income transaction belonging to the authenticated user by its ID.
 *     tags:
 *       - Income
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID.
 *     responses:
 *       200:
 *         description: Income retrieved successfully
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
 *                   example: Income retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Income'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", checkAuth, getIncomeById);

/**
 * @openapi
 * /income/{id}:
 *   put:
 *     summary: Update an income transaction
 *     description: Updates an existing income transaction and adjusts wallet balances if necessary.
 *     tags:
 *       - Income
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Salary
 *               amount:
 *                 type: number
 *                 example: 55000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-01
 *               description:
 *                 type: string
 *                 example: Updated monthly salary
 *               walletId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Income updated successfully
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
 *                   example: Income updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Income'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income, wallet, or income category not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", checkAuth, updateIncome);

/**
 * @openapi
 * /income/{id}:
 *   delete:
 *     summary: Delete an income transaction
 *     description: Deletes an income transaction and updates the associated wallet balance.
 *     tags:
 *       - Income
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Income ID.
 *     responses:
 *       200:
 *         description: Income deleted successfully
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
 *                   example: Income deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", checkAuth, deleteIncome);

export default router;
