import z from "zod";

const idValidator = z.number().int().positive("ID must be a positive number.");

export const createExpenseValidator = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  amount: z.number().positive("Amount must be greater than 0."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  date: z.coerce.date(),

  categoryId: idValidator,

  walletId: idValidator,
});

export const updateExpenseValidator = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty.")
      .max(100, "Title cannot exceed 100 characters.")
      .optional(),

    amount: z.number().positive("Amount must be greater than 0.").optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),

    date: z.coerce.date().optional(),

    categoryId: idValidator.optional(),

    walletId: idValidator.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });
