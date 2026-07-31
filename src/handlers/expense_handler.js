import prisma from "../db/prisma.js";
import {
  buildPagination,
  buildPaginationMetadata,
} from "../utils/pagination_utils.js";
import { buildSort } from "../utils/sort_utils.js";
import { buildTransactionFilters } from "../utils/transaction_filters_utils.js";
import {
  createExpenseValidator,
  updateExpenseValidator,
} from "../validators/expense_validator.js";
import { transactionQueryValidator } from "../validators/transaction_query_validator.js";

export const getExpenses = async (req, res) => {
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

    const [expenses, totalItems] = await Promise.all([
      prisma.expense.findMany({
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
      prisma.expense.count({
        where,
      }),
    ]);

    const pagination = buildPaginationMetadata(page, limit, totalItems);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getExpenseById = async (req, res) => {
  const expenseId = Number(req.params.id);

  try {
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.user.id,
      },
      include: { category: true },
    });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const createExpense = async (req, res) => {
  const result = createExpenseValidator.safeParse(req.body);

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

  const { categoryId, walletId, amount, ...expenseData } = result.data;

  try {
    const expense = await prisma.$transaction(async (tx) => {
      // Verify category exists, belongs to user, and is an expense category
      const category = await tx.category.findFirst({
        where: {
          id: categoryId,
          userId: req.user.id,
          type: "EXPENSE",
        },
      });

      if (!category) {
        throw new Error("Expense category not found.");
      }

      // Verify wallet exists and belongs to user
      const wallet = await tx.wallet.findFirst({
        where: {
          id: walletId,
          userId: req.user.id,
        },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      // Optional: prevent negative balance
      if (wallet.balance < amount) {
        throw new Error("Insufficient wallet balance.");
      }

      // Create expense
      const expense = await tx.expense.create({
        data: {
          ...expenseData,
          amount,
          categoryId,
          walletId,
          userId: req.user.id,
        },
      });

      // Update wallet balance
      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return expense;
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense,
    });
  } catch (e) {
    if (
      e.message === "Expense category not found." ||
      e.message === "Wallet not found." ||
      e.message === "Insufficient wallet balance."
    ) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  const id = Number(req.params.id);

  const result = updateExpenseValidator.safeParse(req.body);

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

  const data = result.data;

  try {
    const updatedExpense = await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!expense) {
        throw new Error("Expense not found.");
      }

      // Validate category if changed
      if (data.categoryId) {
        const category = await tx.category.findFirst({
          where: {
            id: data.categoryId,
            userId: req.user.id,
            type: "EXPENSE",
          },
        });

        if (!category) {
          throw new Error("Expense category not found.");
        }
      }

      const oldWalletId = expense.walletId;
      const newWalletId = data.walletId ?? oldWalletId;

      const oldAmount = expense.amount;
      const newAmount = data.amount ?? oldAmount;

      // Wallet changed
      if (oldWalletId !== newWalletId) {
        const newWallet = await tx.wallet.findFirst({
          where: {
            id: newWalletId,
            userId: req.user.id,
          },
        });

        if (!newWallet) {
          throw new Error("Wallet not found.");
        }

        if (newWallet.balance < newAmount) {
          throw new Error("Insufficient wallet balance.");
        }

        // Refund old wallet
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: {
            balance: {
              increment: oldAmount,
            },
          },
        });

        // Deduct from new wallet
        await tx.wallet.update({
          where: { id: newWalletId },
          data: {
            balance: {
              decrement: newAmount,
            },
          },
        });
      } else if (oldAmount !== newAmount) {
        // Same wallet, amount changed

        const difference = newAmount - oldAmount;

        const wallet = await tx.wallet.findFirst({
          where: {
            id: oldWalletId,
            userId: req.user.id,
          },
        });

        if (!wallet) {
          throw new Error("Wallet not found.");
        }

        if (difference > 0 && wallet.balance < difference) {
          throw new Error("Insufficient wallet balance.");
        }

        await tx.wallet.update({
          where: {
            id: oldWalletId,
          },
          data: {
            balance:
              difference > 0
                ? { decrement: difference }
                : { increment: Math.abs(difference) },
          },
        });
      }

      return await tx.expense.update({
        where: {
          id,
        },
        data,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (e) {
    if (
      e.message === "Expense not found." ||
      e.message === "Expense category not found." ||
      e.message === "Wallet not found." ||
      e.message === "Insufficient wallet balance."
    ) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.$transaction(async (tx) => {
      // Find the expense and verify ownership
      const expense = await tx.expense.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!expense) {
        throw new Error("Expense not found.");
      }

      // Restore the wallet balance
      await tx.wallet.update({
        where: {
          id: expense.walletId,
        },
        data: {
          balance: {
            increment: expense.amount,
          },
        },
      });

      // Delete the expense
      await tx.expense.delete({
        where: {
          id,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (e) {
    if (e.message === "Expense not found.") {
      return res.status(404).json({
        success: false,
        message: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};
