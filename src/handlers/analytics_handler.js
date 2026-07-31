import prisma from "../db/prisma.js";
import {
  mapCategoryTotals,
  groupTransactionsByMonth,
} from "../utils/analytics_utils.js";
import { buildDateFilter } from "../utils/date_utils.js";

// Shows how much has been spent in each category.
export const getExpenseByCategory = async (req, res) => {
  const userId = req.user.id;

  try {
    const { dateFilter } = buildDateFilter(req.query);
    // Calculate total expense amount for each category
    const groupedExpenses = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && {
          date: dateFilter,
        }),
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    // Retrieve category names
    const categories = await prisma.category.findMany({
      where: {
        userId,
        type: "EXPENSE",
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Combine grouped totals with category names
    const expenseAnalytics = mapCategoryTotals(groupedExpenses, categories);

    return res.status(200).json({
      success: true,
      message: "Expense analytics retrieved successfully.",
      data: expenseAnalytics,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve expense analytics.",
      error: e.message,
    });
  }
};

export const getIncomeByCategory = async (req, res) => {
  const userId = req.user.id;

  try {
    const { dateFilter } = buildDateFilter(req.query);
    // Calculate total income amount for each category
    const groupedIncomes = await prisma.income.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && {
          date: dateFilter,
        }),
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    // Retrieve category names
    const categories = await prisma.category.findMany({
      where: {
        userId,
        type: "INCOME",
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Combine grouped totals with category names
    const incomeAnalytics = mapCategoryTotals(groupedIncomes, categories);

    return res.status(200).json({
      success: true,
      message: "Income analytics retrieved successfully.",
      data: incomeAnalytics,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve income analytics.",
      error: e.message,
    });
  }
};

// Shows the total expenses for each month.
export const getMonthlyExpenseTrend = async (req, res) => {
  const userId = req.user.id;

  try {
    const { dateFilter, startDate, endDate } = buildDateFilter(req.query);
    // Retrieve all expenses ordered by date
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && {
          date: dateFilter,
        }),
      },
      select: {
        amount: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group expenses by month
    const monthlyExpenses = groupTransactionsByMonth(
      expenses,
      startDate,
      endDate,
    );

    return res.status(200).json({
      success: true,
      message: "Monthly expense trend retrieved successfully.",
      data: monthlyExpenses,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve monthly expense trend.",
      error: e.message,
    });
  }
};

export const getMonthlyIncomeTrend = async (req, res) => {
  const userId = req.user.id;

  try {
    const { dateFilter, startDate, endDate } = buildDateFilter(req.query);

    // Retrieve all incomes ordered by date
    const incomes = await prisma.income.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && {
          date: dateFilter,
        }),
      },
      select: {
        amount: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group incomes by month
    const monthlyIncomes = groupTransactionsByMonth(
      incomes,
      startDate,
      endDate,
    );

    return res.status(200).json({
      success: true,
      message: "Monthly income trend retrieved successfully.",
      data: monthlyIncomes,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve monthly income trend.",
      error: e.message,
    });
  }
};
