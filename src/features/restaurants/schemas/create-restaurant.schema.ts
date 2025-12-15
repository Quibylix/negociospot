import { z } from "zod";

export const createRestaurantBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(800).optional(),
  address: z.string().min(1).max(200).optional(),
  coverImgUrl: z.url().optional(),
});

export const createRestaurantResponseSchema = z
  .object({
    id: z.number(),
  })
  .or(
    z.object({
      error: z.string(),
    }),
  );
