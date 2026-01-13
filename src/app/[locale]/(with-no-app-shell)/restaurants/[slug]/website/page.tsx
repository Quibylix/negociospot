import { Box, Container, Paper } from "@mantine/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { Logger } from "@/features/logger/logger";
import { RestaurantDetail } from "@/features/restaurants/components/restaurant-detail/restaurant-detail.component";
import {
  type RestaurantDetailProps,
  restaurantDetailAdapterSchema,
} from "@/features/restaurants/components/restaurant-detail/service-to-detail-adapter";
import { RestaurantsService } from "@/features/restaurants/service";

const getRestaurantBySlug = cache(async (slug: string) => {
  return RestaurantsService.getRestaurantBySlug(slug);
});

export default async function RestaurantWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await getRestaurantBySlug(slug).catch((error) => {
    Logger.warn(`Restaurant with slug "${slug}" not found.`, error);
    return null;
  });

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
    <Box mih="100vh" bg="var(--mantine-color-gray-light)">
      <Container size="xl" p={0}>
        <Paper shadow="md" radius="md" pb="xl">
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
        </Paper>
      </Container>
    </Box>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations();

  const restaurant = await getRestaurantBySlug(slug).catch((error) => {
    Logger.warn(`Restaurant with slug "${slug}" not found.`, error);
    return null;
  });

  if (!restaurant) {
    return {
      title: t("errors.restaurants.not_found"),
    };
  }

  return {
    title: restaurant.name,
    ...(restaurant.description ? { description: restaurant.description } : {}),
    openGraph: {
      title: restaurant.name,
      description: restaurant.description || undefined,
      images: restaurant.coverImgUrl
        ? [
            {
              url: restaurant.coverImgUrl,
              width: 800,
              height: 300,
              alt: restaurant.name,
            },
          ]
        : undefined,
    },
  };
}
