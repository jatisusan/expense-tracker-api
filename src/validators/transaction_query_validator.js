import z from "zod";

export const transactionQueryValidator = z
  .object({
    // Pagination
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    // Search
    search: z.string().trim().min(1).optional(),

    // Filters
    categoryId: z.coerce.number().int().positive().optional(),

    walletId: z.coerce.number().int().positive().optional(),

    minAmount: z.coerce.number().min(0).optional(),

    maxAmount: z.coerce.number().min(0).optional(),

    // Date filters
    year: z.coerce.number().int().min(2000).max(2100).optional(),

    from: z.string().date().optional(),

    to: z.string().date().optional(),

    // Sorting
    sort: z.enum(["date", "amount"]).default("date"),

    order: z.enum(["asc", "desc"]).default("desc"),
  })

  // minAmount <= maxAmount
  .refine(
    (data) =>
      data.minAmount === undefined ||
      data.maxAmount === undefined ||
      data.minAmount <= data.maxAmount,
    {
      message: "Minimum amount cannot exceed maximum amount.",
      path: ["minAmount"],
    },
  )

  // from <= to
  .refine(
    (data) =>
      !data.from || !data.to || new Date(data.from) <= new Date(data.to),
    {
      message: "'From' date cannot be after 'To' date.",
      path: ["from"],
    },
  )

  // Don't allow year with from/to
  .refine(
    (data) => {
      if (!data.year) return true;

      return !data.from && !data.to;
    },
    {
      message: "Use either 'year' or 'from'/'to' filters, not both.",
      path: ["year"],
    },
  );
