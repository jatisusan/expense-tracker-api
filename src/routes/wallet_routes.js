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

router.get("/", checkAuth, getWallets);
router.post("/", checkAuth, createWallet);
router.get("/:id", checkAuth, getWalletById);
router.put("/:id", checkAuth, updateWallet);
router.delete("/:id", checkAuth, deleteWallet);

export default router;
