import { z } from "zod";
import { ERROR_VALUES } from "@/features/shared/constants/errors";

export const updateMenuBodySchema = z.object({
  name: z.string().min(1).max(100),
  categories: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1).max(100),
        items: z
          .array(
            z.object({
              id: z.number().optional(),
              name: z.string().min(1).max(100),
              description: z.string().max(500).optional(),
              price: z.int().min(0),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export const updateMenuResponseSchema = z
  .object({
    id: z.number(),
  })
  .or(
    z.object({
      error: z.enum(ERROR_VALUES),
    }),
  );
