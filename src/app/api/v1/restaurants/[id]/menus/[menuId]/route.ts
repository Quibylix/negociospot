import type { z } from "zod";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import {
  updateMenuBodySchema,
  type updateMenuResponseSchema,
} from "@/features/menus/schemas/update-menu.schema";
import {
  checkMenuBelongsToRestaurant,
  updateMenu,
} from "@/features/menus/service";
import { getRestaurantAccessInfo } from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const PUT = createTypedJsonRoute<
  z.infer<typeof updateMenuResponseSchema>,
  { params: Promise<{ id: string; menuId: string }> }
>(async (req, { params }) => {
  const { id: restaurantSlug, menuId } = await params;

  const user = await AuthService.getCurrentUser();

  if (!Number(menuId))
    return typedJsonResponse({ error: ERRORS.MENUS.INVALID_MENU_ID }, 400);

  const accessInfoResult = await getRestaurantAccessInfo({
    uid: { slug: restaurantSlug },
  });

  if (accessInfoResult.isErr()) {
    Logger.error("Error fetching restaurant access info", {
      error: accessInfoResult.error,
      restaurantSlug,
    });
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  if (accessInfoResult.value === null)
    return typedJsonResponse({ error: ERRORS.RESTAURANTS.NOT_FOUND }, 404);

  const accessInfo = {
    creatorId: accessInfoResult.value.createdById,
    admins: accessInfoResult.value.administrators.map(
      (admin) => admin.profileId,
    ),
  };

  const belongsToRestaurant = await checkMenuBelongsToRestaurant(
    Number(menuId),
    restaurantSlug,
  ).catch(() => {
    Logger.error("Failed to verify menu ownership", {
      menuId,
      restaurantSlug,
    });
    return null;
  });

  if (belongsToRestaurant === null) {
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  if (
    !check(user)
      .can("edit", "Menu")
      .verify({ ...accessInfo, belongsToRestaurant })
  ) {
    return typedJsonResponse({ error: ERRORS.MENUS.UNAUTHORIZED_EDITION }, 403);
  }

  const body = await req.json();
  let parsedBody: z.infer<typeof updateMenuBodySchema>;
  try {
    parsedBody = updateMenuBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid menu edition data", { error: e });
    return typedJsonResponse({ error: ERRORS.MENUS.INVALID_EDITION_DATA }, 400);
  }

  const { name, categories } = parsedBody;

  let menu: Awaited<ReturnType<typeof updateMenu>>;
  try {
    menu = await updateMenu(Number(menuId), {
      name,
      categories,
    });
  } catch (err) {
    Logger.error("Failed to update menu", { error: err });
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  return typedJsonResponse({ id: menu.id });
});
