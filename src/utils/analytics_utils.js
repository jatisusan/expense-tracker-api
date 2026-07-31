/*
Groups transactions by month and calculates the total amount for each month.
If startDate and endDate are provided, missing months are included with an amount of 0.

Example:
[
  { amount: 1000, date: "2026-07-01" },
  { amount: 500, date: "2026-07-15" },
  { amount: 800, date: "2026-08-01" }
]
  
Returns:
[
  { month: "Jul 2026", amount: 1500 },
  { month: "Aug 2026", amount: 800 }
]
*/
export const groupTransactionsByMonth = (transactions, startDate, endDate) => {
  const monthlyTotals = {};

  // Populate every month in the requested range.
  if (startDate && endDate) {
    const current = new Date(startDate);

    // Always start at the first day of the month.
    current.setDate(1);

    while (current <= endDate) {
      const monthKey = `${current.getFullYear()}-${String(
        current.getMonth() + 1,
      ).padStart(2, "0")}`;

      monthlyTotals[monthKey] = 0;

      // Move to the next month.
      current.setMonth(current.getMonth() + 1);
    }
  }

  // Add transaction amounts.
  for (const transaction of transactions) {
    const date = new Date(transaction.date);

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    // Handles the case where no range was supplied.
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = 0;
    }

    monthlyTotals[monthKey] += transaction.amount;
  }

  const monthlyEntries = Object.entries(monthlyTotals);

  monthlyEntries.sort(([monthA], [monthB]) => monthA.localeCompare(monthB));

  const result = [];

  for (const [monthKey, amount] of monthlyEntries) {
    const [year, month] = monthKey.split("-");

    // Convert "2026-07" into "Jul 2026"
    const monthLabel = new Date(year, Number(month) - 1).toLocaleString(
      "default",
      {
        month: "short",
        year: "numeric",
      },
    );

    result.push({
      month: monthLabel,
      amount,
    });
  }

  return result;
};

/**
 * Maps grouped category totals to their category names.
 *
 * Example groupedData:
 * [
 *   { categoryId: 1, _sum: { amount: 5000 } },
 *   { categoryId: 2, _sum: { amount: 1200 } }
 * ]
 *
 * Example categories:
 * [
 *   { id: 1, name: "Salary" },
 *   { id: 2, name: "Freelancing" }
 * ]
 */
export const mapCategoryTotals = (groupedData, categories) => {
  // Create a lookup object for fast category name access.
  // Example:
  // {
  //   1: "Salary",
  //   2: "Freelancing"
  // }
  const categoryMap = {};

  for (const category of categories) {
    categoryMap[category.id] = category.name;
  }

  const result = [];

  // Combine grouped totals with category names.
  for (const item of groupedData) {
    result.push({
      categoryId: item.categoryId,
      category: categoryMap[item.categoryId] ?? "Unknown",
      amount: item._sum.amount ?? 0,
    });
  }

  return result;
};
