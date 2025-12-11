import { z } from "zod";

export const loginBodySchema = z
  .object({
    provider: z.literal("email"),
    email: z.email(),
    password: z.string().min(6).max(100),
  })
  .or(
    z.object({
      provider: z.literal("google"),
    }),
  );

export const loginResponseSchema = z
  .object({
    error: z.string().optional(),
  })
  .or(z.null());
