import z from "zod";
import { ERROR_VALUES } from "@/features/shared/constants/errors";

export const favoriteRestaurantResponseSchema = z
  .object({
    error: z.enum(ERROR_VALUES),
  })
  .or(z.null());
