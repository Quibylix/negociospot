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

export type RestaurantDetailProps = BaseRestaurantDetailProps & {
  canEdit: boolean;
  slug: string;
  canEditMenus: boolean;
  canCreateMenus: boolean;
  isFavorite: boolean;
  canFavorite: boolean;
};

export function RestaurantDetail({
  coverImgUrl,
  name,
  tags,
  reviews,
  description,
  address,
  schedule,
  phone,
  whatsapp,
  lat,
  lng,
  canEdit,
  slug,
  menus,
  canEditMenus,
  canCreateMenus,
  isFavorite,
  canFavorite,
}: RestaurantDetailProps) {
  const t = useTranslations("restaurant.detail");

  const ratingAvg =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : 0;

  const website = Result.fromThrowable(
    () => new URL(process.env.NEXT_PUBLIC_SITE_URL ?? ""),
  )()
    .map((url) => `${url.protocol}//${slug}.${url.host}`)
    .unwrapOr(process.env.NEXT_PUBLIC_SITE_URL ?? "");

  return (
    <>
      <RestaurantDetailHero
        coverImgUrl={coverImgUrl}
        name={name}
        tags={tags}
        reviewsCount={reviews.length}
        ratingAvg={ratingAvg}
        canEdit={canEdit}
        isFavorite={isFavorite}
        canFavorite={canFavorite}
        slug={slug}
      />
      <Container size="lg" mt={60} mb="xl">
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 4 }}>
            <RestaurantDetailBasicInfo
              description={description}
              address={address}
              lat={lat}
              lng={lng}
              schedule={schedule}
              phone={phone}
              whatsapp={whatsapp}
              website={website}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="menus" variant="outline">
              <TabsList mb="md">
                <TabsTab value="menus">{t("menu")}</TabsTab>
                <TabsTab value="reviews">{t("reviews")}</TabsTab>
              </TabsList>
              <TabsPanel value="menus">
                <RestaurantDetailMenus
                  menus={menus}
                  canEditMenus={canEditMenus}
                  canCreateMenus={canCreateMenus}
                  slug={slug}
                />
              </TabsPanel>
              <TabsPanel value="reviews">
                <RestaurantDetailReviews reviews={reviews} />
              </TabsPanel>
            </Tabs>
          </GridCol>
        </Grid>
      </Container>
    </>
  );
}
