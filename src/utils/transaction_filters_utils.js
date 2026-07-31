import { buildDateFilter } from "./date_utils.js";

/*
 Builds the Prisma `where` object for transaction queries.
 Supports:
 - search
 - categoryId
 - walletId
 - amount range
 - date range
 */
export const buildTransactionFilters = (query, userId) => {
  const { search, categoryId, walletId, minAmount, maxAmount } = query;

  // Every transaction query belongs to a user.
  const where = {
    userId,
  };

  // Search by title/description
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Filter by category
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Filter by wallet
  if (walletId) {
    where.walletId = walletId;
  }

  // Filter by amount
  if (minAmount || maxAmount) {
    where.amount = {};

    if (minAmount) {
      where.amount.gte = minAmount;
    }

    if (maxAmount) {
      where.amount.lte = maxAmount;
    }
  }

  // Date filter
  const { dateFilter } = buildDateFilter(query);

  if (Object.keys(dateFilter).length > 0) {
    where.date = dateFilter;
  }

  return where;
};
