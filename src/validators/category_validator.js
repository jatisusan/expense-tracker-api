import z from "zod";

export const categoryValidator = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["INCOME", "EXPENSE"], "Invalid category type"),
});

export const categoryQueryValidator = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
});