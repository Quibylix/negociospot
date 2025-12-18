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
            <Tabs defaultValue="menus" variant="outline">
              <TabsList mb="md">
                <TabsTab value="menus">{t("menu")}</TabsTab>
                <TabsTab value="reviews">{t("reviews")}</TabsTab>
              </TabsList>
              <TabsPanel value="menus">
                {menus.length === 0 ? (
                  <Text c="dimmed" ta="center" py="xl">
                    {t("no_menu")}
                  </Text>
                ) : (
                  <Tabs defaultValue={`menu.${menus[0].id}`} variant="default">
                    <TabsList>
                      {menus.map((menu) => (
                        <TabsTab key={menu.id} value={`menu.${menu.id}`}>
                          {menu.name}
                        </TabsTab>
                      ))}
                    </TabsList>
                    {menus.map((menu) => (
                      <TabsPanel
                        mt="md"
                        key={menu.id}
                        value={`menu.${menu.id}`}
                      >
                        <RestaurantDetailMenu categories={menu.categories} />
                      </TabsPanel>
                    ))}
                  </Tabs>
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
