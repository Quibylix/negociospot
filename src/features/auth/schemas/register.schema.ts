import { z } from "zod";
import { ERROR_VALUES } from "@/features/shared/constants/errors";

export const registerBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const registerResponseSchema = z
  .object({
    error: z.enum(ERROR_VALUES).optional(),
  })
  .or(z.null());
