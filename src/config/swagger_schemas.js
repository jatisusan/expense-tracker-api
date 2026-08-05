export const schemas = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "John Doe",
      },
      email: {
        type: "string",
        example: "john@example.com",
      },
    },
  },

  Category: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Food",
      },
      type: {
        type: "string",
        enum: ["INCOME", "EXPENSE"],
        example: "EXPENSE",
      },
      userId: {
        type: "integer",
        example: 1,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
    },
  },

  Wallet: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Cash",
      },
      balance: {
        type: "number",
        example: 1000,
      },
      userId: {
        type: "integer",
        example: 1,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
    },
  },

  Income: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      title: {
        type: "string",
        example: "Salary",
      },
      amount: {
        type: "number",
        example: 50000,
      },
      description: {
        type: "string",
        nullable: true,
        example: "Monthly salary",
      },
      date: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T00:00:00.000Z",
      },
      category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "Salary",
          },
        },
      },
      wallet: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "Bank Account",
          },
        },
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
    },
  },

  Expense: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      title: {
        type: "string",
        example: "Groceries",
      },
      amount: {
        type: "number",
        example: 2500,
      },
      description: {
        type: "string",
        nullable: true,
        example: "Weekly shopping",
      },
      date: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T00:00:00.000Z",
      },
      category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 2,
          },
          name: {
            type: "string",
            example: "Food",
          },
        },
      },
      wallet: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "Cash",
          },
        },
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
    },
  },

  Budget: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      amount: {
        type: "number",
        example: 10000,
      },
      month: {
        type: "integer",
        example: 8,
      },
      year: {
        type: "integer",
        example: 2026,
      },
      category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 2,
          },
          name: {
            type: "string",
            example: "Food",
          },
        },
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T07:15:30.000Z",
      },
    },
  },

  DashboardSummary: {
    type: "object",
    properties: {
      currentBalance: {
        type: "number",
        example: 125000,
      },
      totalIncome: {
        type: "number",
        example: 450000,
      },
      totalExpense: {
        type: "number",
        example: 325000,
      },
      thisMonthIncome: {
        type: "number",
        example: 50000,
      },
      thisMonthExpense: {
        type: "number",
        example: 32000,
      },
      thisMonthSavings: {
        type: "number",
        example: 18000,
      },
      incomeCount: {
        type: "integer",
        example: 18,
      },
      expenseCount: {
        type: "integer",
        example: 74,
      },
      largestIncome: {
        $ref: "#/components/schemas/DashboardTransaction",
      },
      largestExpense: {
        $ref: "#/components/schemas/DashboardTransaction",
      },
    },
  },

  DashboardTransaction: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 5,
      },
      title: {
        type: "string",
        example: "Salary",
      },
      amount: {
        type: "number",
        example: 50000,
      },
      date: {
        type: "string",
        format: "date",
        example: "2026-08-01",
      },
    },
  },

  RecentTransaction: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 12,
      },
      title: {
        type: "string",
        example: "Groceries",
      },
      amount: {
        type: "number",
        example: 2500,
      },
      date: {
        type: "string",
        format: "date",
        example: "2026-08-03",
      },
      type: {
        type: "string",
        enum: ["INCOME", "EXPENSE"],
        example: "EXPENSE",
      },
    },
  },

  CategoryAnalytics: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      name: {
        type: "string",
        example: "Food",
      },
      total: {
        type: "number",
        example: 12500,
      },
    },
  },

  MonthlyTrend: {
    type: "object",
    properties: {
      month: {
        type: "string",
        example: "Jan 2026",
      },
      total: {
        type: "number",
        example: 45800,
      },
    },
  },

  Pagination: {
    type: "object",
    properties: {
      page: {
        type: "integer",
        example: 1,
      },
      limit: {
        type: "integer",
        example: 10,
      },
      totalItems: {
        type: "integer",
        example: 57,
      },
      totalPages: {
        type: "integer",
        example: 6,
      },
      hasNextPage: {
        type: "boolean",
        example: true,
      },
      hasPreviousPage: {
        type: "boolean",
        example: false,
      },
    },
  },

  ValidationError: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Validation failed.",
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              example: "email",
            },
            message: {
              type: "string",
              example: "Email is required.",
            },
          },
        },
      },
    },
  },

  UnauthorizedError: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: false,
      },

      message: {
        type: "string",
        example: "Authorization header missing.",
      },
    },
  },

  NotFoundError: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: false,
      },

      message: {
        type: "string",
        example: "Resource not found.",
      },
    },
  },

  ConflictError: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Conflict occurred.",
      },
    },
  },
};
