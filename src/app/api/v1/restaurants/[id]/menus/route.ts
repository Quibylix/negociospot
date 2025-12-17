import type { z } from "zod";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import {
  createMenuBodySchema,
  type createMenuResponseSchema,
} from "@/features/menus/schemas/create-menu.schema";
import { createMenu } from "@/features/menus/service";
import { RestaurantsService } from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const POST = createTypedJsonRoute<
  z.infer<typeof createMenuResponseSchema>,
  { params: Promise<{ id: string }> }
>(async (req, { params }) => {
  const { id: restaurantSlug } = await params;

  const user = await AuthService.getCurrentUser();

  const restaurantAdmins = await RestaurantsService.getRestaurantAdminsBySlug(
    restaurantSlug,
  )
    .then((res) => res?.administrators.map((admin) => admin.profile.id) ?? [])
    .catch(() => {
      Logger.error("Failed to fetch restaurant admins", {
        restaurantSlug,
      });
      return null;
    });

  if (restaurantAdmins === null) {
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  if (
    !check(user).can("create", "Menu").verify({ admins: restaurantAdmins }) ||
    !user
  ) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.UNAUTHORIZED_EDITION },
      403,
    );
  }

  const body = await req.json();
  let parsedBody: z.infer<typeof createMenuBodySchema>;
  try {
    parsedBody = createMenuBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid menu creation data", { error: e });
    return typedJsonResponse(
      { error: ERRORS.MENUS.INVALID_CREATION_DATA },
      400,
    );
  }

  const { name, categories } = parsedBody;

  let menu: Awaited<ReturnType<typeof createMenu>>;
  try {
    menu = await createMenu({
      restaurantSlug,
      name,
      categories,
    });
  } catch (err) {
    Logger.error("Failed to create menu", { error: err });
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  return typedJsonResponse({ id: menu.id });
});
