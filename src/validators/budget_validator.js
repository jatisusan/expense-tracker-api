import z from "zod";

const MAX_YEAR = new Date().getFullYear() + 10;

const monthSchema = z.coerce
  .number()
  .int("Month must be an integer")
  .min(1, "Month must be between 1 and 12")
  .max(12, "Month must be between 1 and 12");

const yearSchema = z.coerce
  .number()
  .int("Year must be an integer")
  .min(2000, "Year must be at least 2000")
  .max(MAX_YEAR, `Year cannot exceed ${MAX_YEAR}`);

const amountSchema = z.coerce
  .number()
  .positive("Budget amount must be greater than 0");

const categoryIdSchema = z.coerce
  .number()
  .int("Category ID must be an integer")
  .positive("Category ID must be a positive number");

export const createBudgetValidator = z.object({
  amount: amountSchema,
  month: monthSchema,
  year: yearSchema,
  categoryId: categoryIdSchema,
});

export const updateBudgetValidator = z
  .object({
    amount: amountSchema.optional(),
    month: monthSchema.optional(),
    year: yearSchema.optional(),
    categoryId: categoryIdSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required to update budget",
  );

export const budgetQueryValidator = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),

  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 10)
    .optional(),
});
