"use client";

import {
  Container,
  Grid,
  GridCol,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@mantine/core";
import { Result } from "neverthrow";
import { useTranslations } from "next-intl";
import { RestaurantDetailBasicInfo } from "./restaurant-detail-basic-info.component";
import { RestaurantDetailHero } from "./restaurant-detail-hero.component";
import { RestaurantDetailMenus } from "./restaurant-detail-menus.component";
import { RestaurantDetailReviews } from "./restaurant-detail-reviews.component";
import type { RestaurantDetailProps as BaseRestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailProps = {
  restaurant: BaseRestaurantDetailProps & {
    slug: string;
    isFavorite: boolean;
    isClaimed?: boolean;
  };
  allowedActions: {
    canEdit: boolean;
    canFavorite: boolean;
    canCreateMenus: boolean;
    canEditMenus: boolean;
    canClaim?: boolean;
    canSuggestChanges?: boolean;
    canSeeReviews?: boolean;
  };
};

export function RestaurantDetail({
  restaurant,
  allowedActions: { canSeeReviews = true, ...allowedActions },
}: RestaurantDetailProps) {
  const t = useTranslations("restaurant.detail");

  const ratingAvg =
    restaurant.reviews.length > 0
      ? restaurant.reviews.reduce((a, b) => a + b.rating, 0) /
        restaurant.reviews.length
      : 0;

  const website = Result.fromThrowable(
    () => new URL(process.env.NEXT_PUBLIC_SITE_URL ?? ""),
  )()
    .map((url) => `${url.protocol}//${restaurant.slug}.${url.host}`)
    .unwrapOr(process.env.NEXT_PUBLIC_SITE_URL ?? "");

  return (
    <>
      <RestaurantDetailHero
        restaurant={{
          coverImgUrl: restaurant.coverImgUrl,
          name: restaurant.name,
          tags: restaurant.tags,
          reviewsCount: restaurant.reviews.length,
          ratingAvg,
          isFavorite: restaurant.isFavorite,
          slug: restaurant.slug,
          isClaimed: Boolean(restaurant.isClaimed),
        }}
        allowedActions={{
          canEdit: allowedActions.canEdit,
          canSuggestChanges: allowedActions.canSuggestChanges ?? false,
          canFavorite: allowedActions.canFavorite,
          canSeeReviews: canSeeReviews,
        }}
      />
      <Container size="lg" mt={60} mb="xl">
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 4 }}>
            <RestaurantDetailBasicInfo
              description={restaurant.description}
              address={restaurant.address}
              lat={restaurant.lat}
              lng={restaurant.lng}
              schedule={restaurant.schedule}
              phone={restaurant.phone}
              whatsapp={restaurant.whatsapp}
              website={website}
              canClaim={allowedActions.canClaim ?? false}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="menus" variant="outline">
              <TabsList mb="md">
                <TabsTab value="menus">{t("menu")}</TabsTab>
                {canSeeReviews && (
                  <TabsTab value="reviews">{t("reviews")}</TabsTab>
                )}
              </TabsList>
              <TabsPanel value="menus">
                <RestaurantDetailMenus
                  menus={restaurant.menus}
                  canEditMenus={allowedActions.canEditMenus}
                  canCreateMenus={allowedActions.canCreateMenus}
                  slug={restaurant.slug}
                />
              </TabsPanel>
              <TabsPanel value="reviews">
                {canSeeReviews && (
                  <RestaurantDetailReviews reviews={restaurant.reviews} />
                )}
              </TabsPanel>
            </Tabs>
          </GridCol>
        </Grid>
      </Container>
    </>
  );
}
