import { Container } from "@mantine/core";
import { notFound } from "next/navigation";
import { Logger } from "@/features/logger/logger";
import { RestaurantDetail } from "@/features/restaurants/components/restaurant-detail/restaurant-detail.component";
import {
  type RestaurantDetailProps,
  restaurantDetailAdapterSchema,
} from "@/features/restaurants/components/restaurant-detail/service-to-detail-adapter";
import { RestaurantsService } from "@/features/restaurants/service";
import { PoweredByFloating } from "@/features/ui/powered-by-floating.component";

export default async function RestaurantWebsitePage({
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

  return (
    <Container fluid p={0} pb="xl">
      <RestaurantDetail
        restaurant={{ ...parsedRestaurant, slug, isFavorite: false }}
        allowedActions={{
          canEdit: false,
          canFavorite: false,
          canCreateMenus: false,
          canEditMenus: false,
          canSeeReviews: false,
        }}
      />
      <PoweredByFloating />
    </Container>
  );
}
