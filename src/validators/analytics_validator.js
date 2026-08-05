import { z } from "zod";

export const analyticsQueryValidator = z
  .object({
    year: z.coerce
      .number()
      .int("Year must be an integer")
      .min(2000, "Year must be at least 2000")
      .max(
        new Date().getFullYear() + 10,
        `Year cannot be greater than ${new Date().getFullYear() + 10}`,
      )
      .optional(),

    from: z.coerce.date().optional(),

    to: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from <= data.to;
      }
      return true;
    },
    {
      message: "'from' date must be before or equal to 'to' date",
      path: ["from"],
    },
  );
