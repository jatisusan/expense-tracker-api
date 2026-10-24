import prisma from "../db/prisma.js";
import { getCurrentMonthRange } from "../utils/date_utils.js";

export const getDashboardSummary = async (req, res) => {
  const userId = req.user.id;

  const now = new Date();

  const { startDate: firstDayOfMonth, endDate: lastDayOfMonth } =
    getCurrentMonthRange();

  try {
    const [
      walletBalance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      incomeCount,
      expenseCount,
      largestIncome,
      largestExpense,
    ] = await Promise.all([
      prisma.wallet.aggregate({
        where: {
          userId,
        },
        _sum: {
          balance: true,
        },
      }),

      prisma.income.aggregate({
        where: {
          userId,
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.expense.aggregate({
        where: {
          userId,
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.income.aggregate({
        where: {
          userId,
          date: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.expense.aggregate({
        where: {
          userId,
          date: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.income.count({
        where: {
          userId,
        },
      }),

      prisma.expense.count({
        where: {
          userId,
        },
      }),

      prisma.income.findFirst({
        where: {
          userId,
        },
        orderBy: {
          amount: "desc",
        },
        select: {
          id: true,
          title: true,
          amount: true,
          date: true,
        },
      }),

      prisma.expense.findFirst({
        where: {
          userId,
        },
        orderBy: {
          amount: "desc",
        },
        select: {
          id: true,
          title: true,
          amount: true,
          date: true,
        },
      }),
    ]);

    const currentBalance = walletBalance._sum.balance ?? 0;
    const totalIncomeAmount = totalIncome._sum.amount ?? 0;
    const totalExpenseAmount = totalExpense._sum.amount ?? 0;
    const thisMonthIncome = monthlyIncome._sum.amount ?? 0;
    const thisMonthExpense = monthlyExpense._sum.amount ?? 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        currentBalance,
        totalIncome: totalIncomeAmount,
        totalExpense: totalExpenseAmount,

        thisMonthIncome,
        thisMonthExpense,
        thisMonthSavings: thisMonthIncome - thisMonthExpense,

        incomeCount,
        expenseCount,

        largestIncome,
        largestExpense,
      },
    });
  } catch (e) {
    console.error("Error fetching dashboard summary:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard summary",
    });
  }
};

export const getRecentTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: {
          userId,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          amount: true,
          date: true,
          category: {
            select: {
              name: true,
            },
          },
          wallet: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.income.findMany({
        where: {
          userId,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
        select: {
          id: true,
          title: true,
          amount: true,
          date: true,
          category: {
            select: {
              name: true,
            },
          },
          wallet: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const transactions = [
      ...expenses.map((expense) => ({
        ...expense,
        type: "EXPENSE",
      })),

      ...incomes.map((income) => ({
        ...income,
        type: "INCOME",
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Recent transactions retrieved successfully",
      data: transactions,
    });
  } catch (e) {
    console.error("Error fetching recent transactions:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recent transactions",
    });
  }
};
