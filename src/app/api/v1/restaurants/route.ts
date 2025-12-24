import type z from "zod";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import {
  createRestaurantBodySchema,
  type createRestaurantResponseSchema,
} from "@/features/restaurants/schemas/create-restaurant.schema";
import { RestaurantsService } from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import { createSlug } from "@/features/shared/utils/create-slug.util";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const POST = createTypedJsonRoute<
  z.infer<typeof createRestaurantResponseSchema>
>(async (req) => {
  const user = await AuthService.getCurrentUser();
  if (!check(user).can("create", "Restaurant").verify() || !user) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.UNAUTHORIZED_CREATION },
      403,
    );
  }

  const body = await req.json();
  let parsedBody: z.infer<typeof createRestaurantBodySchema>;
  try {
    parsedBody = createRestaurantBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid restaurant creation data", { error: e });
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.INVALID_CREATION_DATA },
      400,
    );
  }

  const {
    name,
    address,
    description,
    schedule,
    tagIds,
    coverImgUrl,
    lat,
    lng,
  } = parsedBody;

  const randomSlugSuffix = Math.random().toString(36).substring(2, 8);
  const slug = createSlug(name, randomSlugSuffix);

  let restaurant: Awaited<
    ReturnType<typeof RestaurantsService.createRestaurant>
  >;
  try {
    restaurant = await RestaurantsService.createRestaurant({
      name,
      slug,
      address,
      schedule,
      description,
      coverImgUrl,
      tagIds,
      lat,
      lng,
      creatorId: user.id,
    });
  } catch (err) {
    Logger.error("Failed to create restaurant", { error: err });
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  return typedJsonResponse({ id: restaurant.id, slug });
});
