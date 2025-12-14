"use client";

import {
  Container,
  Grid,
  GridCol,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { RestaurantDetailBasicInfo } from "./restaurant-detail-basic-info.component";
import { RestaurantDetailHero } from "./restaurant-detail-hero.component";
import { RestaurantDetailMenu } from "./restaurant-detail-menu.component";
import { RestaurantDetailReviews } from "./restaurant-detail-reviews.component";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

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
  menus,
}: RestaurantDetailProps) {
  const t = useTranslations("restaurant.detail");

  const ratingAvg =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : 0;
  const activeMenu = menus[0];

  return (
    <>
      <RestaurantDetailHero
        coverImgUrl={coverImgUrl}
        name={name}
        tags={tags}
        reviewsCount={reviews.length}
        ratingAvg={ratingAvg}
      />
      <Container size="lg" mt={60} mb="xl">
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 4 }}>
            <RestaurantDetailBasicInfo
              description={description}
              address={address}
              schedule={schedule}
              phone={phone}
              whatsapp={whatsapp}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 8 }}>
            <Tabs defaultValue="menu" variant="outline">
              <TabsList mb="md">
                <TabsTab value="menu">{t("menu")}</TabsTab>
                <TabsTab value="reviews">{t("reviews")}</TabsTab>
              </TabsList>
              <TabsPanel value="menu">
                {!activeMenu ? (
                  <Text c="dimmed" ta="center" py="xl">
                    {t("no_menu")}
                  </Text>
                ) : (
                  <RestaurantDetailMenu categories={activeMenu.categories} />
                )}
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
