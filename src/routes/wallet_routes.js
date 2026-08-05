import { Router } from "express";
import {
  createWallet,
  deleteWallet,
  getWalletById,
  getWallets,
  updateWallet,
} from "../handlers/wallet_handler.js";
import { checkAuth } from "../middlewares/auth_middleware.js";

const router = Router();

/**
 * @openapi
 * /wallets:
 *   get:
 *     summary: Get all wallets
 *     description: Retrieves all wallets belonging to the authenticated user.
 *     tags:
 *       - Wallets
 *     responses:
 *       200:
 *         description: Wallets retrieved successfully
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
 *                   example: Wallets retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", checkAuth, getWallets);

/**
 * @openapi
 * /wallets/{id}:
 *   get:
 *     summary: Get a wallet
 *     description: Retrieves a wallet belonging to the authenticated user by its ID.
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet ID.
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
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
 *                   example: Wallet retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", checkAuth, getWalletById);

/**
 * @openapi
 * /wallets:
 *   post:
 *     summary: Create a wallet
 *     description: Creates a new wallet for the authenticated user.
 *     tags:
 *       - Wallets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cash
 *     responses:
 *       201:
 *         description: Wallet created successfully
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
 *                   example: Wallet created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: A wallet with this name already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", checkAuth, createWallet);

/**
 * @openapi
 * /wallets/{id}:
 *   put:
 *     summary: Update a wallet
 *     description: Updates an existing wallet belonging to the authenticated user.
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cash Wallet
 *     responses:
 *       200:
 *         description: Wallet updated successfully
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
 *                   example: Wallet updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       409:
 *         description: A wallet with this name already exists
 *       500:
 *         description: Internal server error
 */
router.put("/:id", checkAuth, updateWallet);

/**
 * @openapi
 * /wallets/{id}:
 *   delete:
 *     summary: Delete a wallet
 *     description: Deletes a wallet belonging to the authenticated user.
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet ID.
 *     responses:
 *       200:
 *         description: Wallet deleted successfully
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
 *                   example: Wallet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 *       409:
 *         description: Wallet cannot be deleted because it is being used by existing transactions
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", checkAuth, deleteWallet);

export default router;
