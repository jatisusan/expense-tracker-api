import prisma from "../db/prisma.js";
import {
  createWalletValidator,
  updateWalletValidator,
} from "../validators/wallet_validator.js";

export const getWallets = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Wallets retrieved successfully",
      data: wallets,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const getWalletById = async (req, res) => {
  const walletId = Number(req.params.id);

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: req.user.id,
      },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const createWallet = async (req, res) => {
  const result = createWalletValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const wallet = await prisma.wallet.create({
      data: {
        ...result.data,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      data: wallet,
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A wallet with this name already exists.",
        error: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const updateWallet = async (req, res) => {
  const walletId = Number(req.params.id);

  if (isNaN(walletId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid wallet ID.",
    });
  }

  const result = updateWalletValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: req.user.id,
      },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    const updatedWallet = await prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: result.data,
    });

    return res.status(200).json({
      success: true,
      message: "Wallet updated successfully.",
      data: updatedWallet,
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A wallet with this name already exists.",
        error: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const deleteWallet = async (req, res) => {
  const walletId = Number(req.params.id);

  try {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: req.user.id,
      },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    await prisma.wallet.delete({
      where: {
        id: walletId,
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Wallet deleted successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};
