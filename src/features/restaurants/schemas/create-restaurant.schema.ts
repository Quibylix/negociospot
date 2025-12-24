import { z } from "zod";
import { ERROR_VALUES } from "@/features/shared/constants/errors";

export const createRestaurantBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(800).optional(),
  schedule: z.string().min(1).max(300).optional(),
  address: z.string().min(1).max(200).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  tagIds: z.array(z.int().min(1)).optional(),
  coverImgUrl: z.url().optional(),
});

export const createRestaurantResponseSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
  })
  .or(
    z.object({
      error: z.enum(ERROR_VALUES),
    }),
  );
