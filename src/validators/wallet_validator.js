import z from "zod";

export const createWalletValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Wallet name must be at least 2 characters.")
    .max(50, "Wallet name cannot exceed 50 characters."),
});

export const updateWalletValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Wallet name must be at least 2 characters.")
    .max(50, "Wallet name cannot exceed 50 characters.")
    .optional(),
});
