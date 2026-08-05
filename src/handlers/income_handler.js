import prisma from "../db/prisma.js";
import {
  buildPagination,
  buildPaginationMetadata,
} from "../utils/pagination_utils.js";
import { buildSort } from "../utils/sort_utils.js";
import { buildTransactionFilters } from "../utils/transaction_filters_utils.js";
import {
  createIncomeValidator,
  updateIncomeValidator,
} from "../validators/income_validator.js";
import { transactionQueryValidator } from "../validators/transaction_query_validator.js";

export const getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = transactionQueryValidator.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const query = result.data;
    const { page, limit, skip } = buildPagination(query);

    const where = buildTransactionFilters(query, userId);

    const orderBy = buildSort(query);

    const [incomes, totalItems] = await Promise.all([
      prisma.income.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          wallet: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.income.count({
        where,
      }),
    ]);

    const pagination = buildPaginationMetadata(page, limit, totalItems);

    res.status(200).json({
      success: true,
      message: "Incomes retrieved successfully",
      data: incomes,
      pagination,
    });
  } catch (e) {
    console.error("Error fetching incomes:", e);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve incomes",
    });
  }
};

export const getIncomeById = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.id;

  try {
    const income = await prisma.income.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        wallet: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Income retrieved successfully",
      data: income,
    });
  } catch (e) {
    console.error("Error fetching income:", e);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve income",
    });
  }
};

export const createIncome = async (req, res) => {
  const result = createIncomeValidator.safeParse(req.body);

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

  const { title, amount, date, description, categoryId, walletId } =
    result.data;
  const userId = req.user.id;

  try {
    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    // Verify category belongs to user and is an income category
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        type: "INCOME",
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Income category not found",
      });
    }

    const income = await prisma.$transaction(async (tx) => {
      const newIncome = await tx.income.create({
        data: {
          title,
          amount,
          date,
          description,
          userId,
          walletId,
          categoryId,
        },
        include: {
          wallet: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return newIncome;
    });

    return res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: income,
    });
  } catch (e) {
    console.error("Error creating income:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to create income",
    });
  }
};

export const updateIncome = async (req, res) => {
  const id = Number(req.params.id);

  const result = updateIncomeValidator.safeParse(req.body);

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

  const userId = req.user.id;

  try {
    const existingIncome = await prisma.income.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    const { title, amount, date, description, walletId, categoryId } =
      result.data;

    // Validate wallet if changed
    if (walletId && walletId !== existingIncome.walletId) {
      const wallet = await prisma.wallet.findFirst({
        where: {
          id: walletId,
          userId,
        },
      });

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
      }
    }

    // Validate category if changed
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
          type: "INCOME",
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Income category not found",
        });
      }
    }

    const updatedIncome = await prisma.$transaction(async (tx) => {
      const oldWalletId = existingIncome.walletId;
      const newWalletId = walletId ?? oldWalletId;

      const oldAmount = existingIncome.amount;
      const newAmount = amount ?? oldAmount;

      // Wallet changed
      if (oldWalletId !== newWalletId) {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: {
            balance: {
              decrement: oldAmount,
            },
          },
        });

        await tx.wallet.update({
          where: { id: newWalletId },
          data: {
            balance: {
              increment: newAmount,
            },
          },
        });
      }

      // Same wallet but amount changed
      else if (oldAmount !== newAmount) {
        const difference = newAmount - oldAmount;

        await tx.wallet.update({
          where: {
            id: oldWalletId,
          },
          data: {
            balance: {
              increment: difference,
            },
          },
        });
      }

      return await tx.income.update({
        where: {
          id,
        },
        data: {
          title,
          amount,
          date,
          description,
          walletId,
          categoryId,
        },
        include: {
          wallet: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (e) {
    console.error("Error updating income:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to update income",
    });
  }
};

export const deleteIncome = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.id;

  try {
    const income = await prisma.income.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: {
          id: income.walletId,
        },
        data: {
          balance: {
            decrement: income.amount,
          },
        },
      });

      await tx.income.delete({
        where: {
          id,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting income:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to delete income",
    });
  }
};
