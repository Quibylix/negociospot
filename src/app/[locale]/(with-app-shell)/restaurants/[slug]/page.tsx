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
  getRestaurantAccessInfo,
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

  const accessInfoResult = await getRestaurantAccessInfo({ uid: { slug } });

  if (accessInfoResult.isErr()) {
    Logger.error("Error fetching restaurant access info", {
      error: accessInfoResult.error,
      restaurantSlug: slug,
    });
    return null;
  }

  if (accessInfoResult.value === null) return null;

  const accessInfo = {
    creatorId: accessInfoResult.value.createdById,
    admins: accessInfoResult.value.administrators.map(
      (admin) => admin.profileId,
    ),
  };

  const canEdit = check(user).can("edit", "Restaurant").verify(accessInfo);
  const canCreateMenus = check(user).can("create", "Menu").verify(accessInfo);
  const canEditMenus = check(user)
    .can("edit", "Menu")
    .verify({
      ...accessInfo,
      belongsToRestaurant: true,
    });
  const canSuggestChanges = check(user)
    .can("suggestChanges", "Restaurant")
    .verify(accessInfo);

  const canClaim = check(user).can("claim", "Restaurant").verify(accessInfo);

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
        canSuggestChanges,
      }}
    />
  );
}
