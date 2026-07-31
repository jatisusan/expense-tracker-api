export const buildBudgetFilters = (query, userId) => {
  const { month, year } = query;

  return {
    userId,

    ...(month !== undefined && { month }),

    ...(year !== undefined && { year }),
  };
};

export const getBudgetStatus = (percentageUsed) => {
  if (percentageUsed > 100) {
    return "OVER_BUDGET";
  }

  if (percentageUsed >= 80) {
    return "WARNING";
  }

  return "ON_TRACK";
};
