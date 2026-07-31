export const getCurrentMonthRange = () => {
  const now = new Date();

  return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),

    endDate: new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ),
  };
};

export const getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1);

  const end = new Date(year, month, 0);

  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
};

/**
 * Creates a Prisma date filter from query parameters.
 *
 * Supported query params:
 * ?year=2026
 * ?from=2026-01-01&to=2026-06-30
 */
export const buildDateFilter = (query) => {
  const { year, from, to } = query;

  // No filters
  if (!year && !from && !to) {
    return {
      dateFilter: {},
      startDate: null,
      endDate: null,
    };
  }

  // Filter by year
  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    return {
      dateFilter: {
        gte: startDate,
        lte: endDate,
      },
      startDate,
      endDate,
    };
  }

  const dateFilter = {};

  const startDate = from ? new Date(from) : null;
  const endDate = to ? new Date(to) : null;

  if (startDate) {
    dateFilter.gte = startDate;
  }

  if (endDate) {
    dateFilter.lte = endDate;
  }

  return {
    dateFilter,
    startDate,
    endDate,
  };
};
