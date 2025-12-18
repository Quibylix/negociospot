import { z } from "zod";

export const restaurantDetailAdapterSchema = z.object({
  coverImgUrl: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
  name: z.string(),
  tags: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  reviews: z.array(
    z.object({
      id: z.string(),
      rating: z.number(),
      title: z.string(),
      comment: z.string(),
      profile: z.object({
        email: z.string(),
      }),
    }),
  ),
  menus: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      categories: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          menuItems: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              description: z
                .string()
                .nullable()
                .transform((val) => val ?? undefined),
              price: z.number(),
            }),
          ),
        }),
      ),
    }),
  ),
  description: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
  address: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
  schedule: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
  phone: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
  whatsapp: z
    .string()
    .nullable()
    .transform((val) => val ?? undefined),
});

export type RestaurantDetailProps = z.infer<
  typeof restaurantDetailAdapterSchema
>;
