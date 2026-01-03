import { notFound } from "next/navigation";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import { RestaurantDetail } from "@/features/restaurants/components/restaurant-detail/restaurant-detail.component";
import {
  type RestaurantDetailProps,
  restaurantDetailAdapterSchema,
} from "@/features/restaurants/components/restaurant-detail/service-to-detail-adapter";
import {
  isFavoriteRestaurant,
  RestaurantsService,
} from "@/features/restaurants/service";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await RestaurantsService.getRestaurantBySlug(slug).catch(
    (error) => {
      Logger.warn(`Restaurant with slug "${slug}" not found.`, error);
      return null;
    },
  );

  if (!restaurant) {
    notFound();
  }

  let parsedRestaurant: RestaurantDetailProps;
  try {
    parsedRestaurant = restaurantDetailAdapterSchema.parse(restaurant);
  } catch (error) {
    Logger.error(`Restaurant with slug "${slug}" has invalid format.`, error);
    notFound();
  }

  const user = await AuthService.getCurrentUser().catch((error) => {
    Logger.warn("Error fetching current user", { error });
    return null;
  });

  const restaurantAdmins = await RestaurantsService.getRestaurantAdminsBySlug(
    slug,
  ).catch((error) => {
    Logger.error(`Error fetching restaurant admins for slug "${slug}".`, error);
    return null;
  });

  const canEdit =
    Boolean(restaurantAdmins) &&
    check(user)
      .can("edit", "Restaurant")
      .verify({
        admins:
          restaurantAdmins?.administrators.map((admin) => admin.profile.id) ??
          [],
      });
  const canCreateMenus =
    Boolean(restaurantAdmins) &&
    check(user)
      .can("create", "Menu")
      .verify({
        admins:
          restaurantAdmins?.administrators.map((admin) => admin.profile.id) ??
          [],
      });
  const canEditMenus =
    Boolean(restaurantAdmins) &&
    check(user)
      .can("edit", "Menu")
      .verify({
        restaurantAdmins: restaurantAdmins?.administrators.map(
          (admin) => admin.profile.id,
        ) as string[],
        belongsToRestaurant: true,
      });

  const canClaim =
    Boolean(restaurantAdmins) &&
    check(user)
      .can("claim", "Restaurant")
      .verify({
        admins: restaurantAdmins?.administrators.map(
          (admin) => admin.profile.id,
        ) as string[],
      });

  const canFavorite = Boolean(user);
  const isFavorite = user
    ? await isFavoriteRestaurant({
        userId: user.id,
        restaurantUniqueIdentifier: { slug },
      }).unwrapOr(false)
    : false;

  return (
    <RestaurantDetail
      restaurant={{ ...parsedRestaurant, slug, isFavorite }}
      allowedActions={{
        canEdit,
        canFavorite,
        canCreateMenus,
        canEditMenus,
        canClaim,
      }}
    />
  );
}
