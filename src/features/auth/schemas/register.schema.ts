import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const registerResponseSchema = z
  .object({
    error: z.string().optional(),
  })
  .or(z.null());
