import prisma from "../db/prisma.js";
import { buildBudgetFilters, getBudgetStatus } from "../utils/budget_utils.js";
import { getMonthRange } from "../utils/date_utils.js";
import {
  budgetQueryValidator,
  createBudgetValidator,
  updateBudgetValidator,
} from "../validators/budget_validator.js";

export const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = budgetQueryValidator.safeParse(req.query);

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

    const where = buildBudgetFilters(query, userId);

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
        { category: { name: "asc" } },
      ],
    });

    res.json({
      success: true,
      message: "Budgets fetched successfully",
      data: budgets,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const createBudget = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = createBudgetValidator.safeParse(req.body);

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

    const { amount, month, year, categoryId } = result.data;

    // Verify category exists and belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Budgets can only be created for expense categories
    if (category.type !== "EXPENSE") {
      return res.status(400).json({
        success: false,
        message: "Budgets can only be created for expense categories.",
      });
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        month,
        year,
        userId,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully.",
      data: budget,
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A budget already exists for this category, month, and year.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};

export const updateBudget = async (req, res) => {
  const userId = req.user.id;
  const budgetId = Number(req.params.id);

  try {
    const result = updateBudgetValidator.safeParse(req.body);

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

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!existingBudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    // If category is being changed, validate it
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      if (category.type !== "EXPENSE") {
        return res.status(400).json({
          success: false,
          message: "Budgets can only be assigned to expense categories.",
        });
      }
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id: budgetId,
      },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: "Budget updated successfully.",
      data: updatedBudget,
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A budget already exists for this category, month, and year.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};

export const deleteBudget = async (req, res) => {
  const userId = req.user.id;
  const budgetId = Number(req.params.id);

  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });

    return res.json({
      success: true,
      message: "Budget deleted successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};

export const getBudgetSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = budgetQueryValidator.safeParse(req.query);

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

    const where = buildBudgetFilters(query, userId);

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
        { category: { name: "asc" } },
      ],
    });

    if (budgets.length === 0) {
      return res.json({
        success: true,
        message: "Budget summary fetched successfully.",
        data: [],
      });
    }

    const summaries = await Promise.all(
      budgets.map(async (budget) => {
        const { start, end } = getMonthRange(budget.month, budget.year);

        const expenseAggregate = await prisma.expense.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            date: {
              gte: start,
              lte: end,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const spent = expenseAggregate._sum.amount ?? 0;

        const remaining = budget.amount - spent;

        const percentageUsed =
          budget.amount === 0
            ? 0
            : Number(((spent / budget.amount) * 100).toFixed(2));

        const status = getBudgetStatus(percentageUsed);

        return {
          budgetId: budget.id,
          month: budget.month,
          year: budget.year,

          category: budget.category,

          budget: budget.amount,
          spent,
          remaining,
          percentageUsed,
          status,
        };
      }),
    );

    return res.json({
      success: true,
      message: "Budget summary fetched successfully.",
      data: summaries,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: e.message,
    });
  }
};
