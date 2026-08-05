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
    console.error("Error fetching wallets:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (e) {
    console.error("Error fetching wallet:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
    console.error("Error creating wallet:", e);
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A wallet with this name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateWallet = async (req, res) => {
  const walletId = Number(req.params.id);

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
      message: "Wallet updated successfully",
      data: updatedWallet,
    });
  } catch (e) {
    console.error("Error updating wallet:", e);

    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A wallet with this name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
        message: "Wallet not found",
      });
    }

    await prisma.wallet.delete({
      where: {
        id: walletId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Wallet deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting wallet:", e);

    if (e.code === "P2003") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete wallet because it is being used by existing transactions",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
