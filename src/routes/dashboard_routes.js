import { Router } from "express";
import {
  getDashboardSummary,
  getRecentTransactions,
} from "../handlers/dashboard_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     description: Retrieves an overview of the authenticated user's financial data, including balances, income, expenses, savings, transaction counts, and largest transactions.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
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
 *                   example: Dashboard summary retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/DashboardSummary'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/summary", checkAuth, getDashboardSummary);

/**
 * @openapi
 * /dashboard/recent-transactions:
 *   get:
 *     summary: Get recent transactions
 *     description: Retrieves the 10 most recent income and expense transactions for the authenticated user.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Recent transactions retrieved successfully
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
 *                   example: Recent transactions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentTransaction'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/recent", checkAuth, getRecentTransactions);

export default router;
