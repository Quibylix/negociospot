import type z from "zod";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import type { favoriteRestaurantResponseSchema } from "@/features/restaurants/schemas/favorite-restaurant.schema";
import {
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
} from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const POST = createTypedJsonRoute<
  z.infer<typeof favoriteRestaurantResponseSchema>,
  { params: Promise<{ id: string }> }
>(async (_req, { params }) => {
  const { id: restaurantSlug } = await params;

  const user = await AuthService.getCurrentUser();

  if (!user) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.UNAUTHORIZED_FAVORITE },
      403,
    );
  }

  const result = await addFavoriteRestaurant({
    userId: user.id,
    restaurantUniqueIdentifier: { slug: restaurantSlug },
  });

  if (result.isErr()) {
    Logger.warn("Failed to favorite restaurant", {
      userId: user.id,
      restaurantSlug,
      error: result.error,
    });

    if (result.error === ERRORS.RESTAURANTS.ALREADY_FAVORITED) {
      return typedJsonResponse({ error: result.error }, 409);
    }

    return typedJsonResponse({ error: result.error }, 500);
  }

  return typedJsonResponse(null);
});

export const DELETE = createTypedJsonRoute<
  z.infer<typeof favoriteRestaurantResponseSchema>,
  { params: Promise<{ id: string }> }
>(async (_req, { params }) => {
  const { id: restaurantSlug } = await params;

  const user = await AuthService.getCurrentUser();

  if (!user) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.UNAUTHORIZED_FAVORITE },
      403,
    );
  }

  const result = await removeFavoriteRestaurant({
    userId: user.id,
    restaurantUniqueIdentifier: { slug: restaurantSlug },
  });

  if (result.isErr()) {
    Logger.warn("Failed to unfavorite restaurant", {
      userId: user.id,
      restaurantSlug,
      error: result.error,
    });

    if (result.error === ERRORS.RESTAURANTS.NOT_FAVORITED_FOUND) {
      return typedJsonResponse({ error: result.error }, 404);
    }

    return typedJsonResponse({ error: result.error }, 500);
  }

  return typedJsonResponse(null);
});
