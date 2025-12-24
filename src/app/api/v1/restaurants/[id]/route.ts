import type z from "zod";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import {
  updateRestaurantBodySchema,
  type updateRestaurantResponseSchema,
} from "@/features/restaurants/schemas/update-restaurant.schema";
import { RestaurantsService } from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const PUT = createTypedJsonRoute<
  z.infer<typeof updateRestaurantResponseSchema>,
  { params: Promise<{ id: string }> }
>(async (req, { params }) => {
  const { id } = await params;

  const user = await AuthService.getCurrentUser();

  if (!Number(id)) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.INVALID_RESTAURANT_ID },
      400,
    );
  }

  const restaurantAdmins = await RestaurantsService.getRestaurantAdminsById(
    Number(id),
  )
    .then((res) => res?.administrators.map((admin) => admin.profile.id) ?? [])
    .catch(() => {
      Logger.error("Failed to fetch restaurant admins", { restaurantId: id });
      return null;
    });

  if (restaurantAdmins === null) {
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  if (
    !check(user)
      .can("edit", "Restaurant")
      .verify({ admins: restaurantAdmins }) ||
    !user
  ) {
    return typedJsonResponse(
      { error: ERRORS.MENUS.UNAUTHORIZED_CREATION },
      403,
    );
  }

  const body = await req.json();
  let parsedBody: z.infer<typeof updateRestaurantBodySchema>;
  try {
    parsedBody = updateRestaurantBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid restaurant edition data", { error: e });
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.INVALID_EDITION_DATA },
      400,
    );
  }

  const {
    name,
    address,
    description,
    schedule,
    tagIds,
    lat,
    lng,
    coverImgUrl,
  } = parsedBody;

  let restaurant: Awaited<
    ReturnType<typeof RestaurantsService.updateRestaurant>
  >;
  try {
    restaurant = await RestaurantsService.updateRestaurant(
      { id: Number(id) },
      {
        name,
        address,
        schedule,
        description,
        coverImgUrl,
        tagIds,
        lat,
        lng,
      },
    );
  } catch (err) {
    Logger.error("Failed to update restaurant", { error: err });
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  return typedJsonResponse({ id: restaurant.id, slug: restaurant.slug });
});
