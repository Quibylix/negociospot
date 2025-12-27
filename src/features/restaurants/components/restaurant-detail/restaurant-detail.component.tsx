"use client";

import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/features/i18n/navigation";
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
  lat,
  lng,
  canEdit,
  canCreateMenus,
  canEditMenus,
  slug,
}: RestaurantDetailProps & {
  canEdit: boolean;
  canCreateMenus: boolean;
  canEditMenus: boolean;
  slug: string;
}) {
  const [activeMenuTabId, setActiveMenuTabId] = useState(
    menus.length > 0 ? menus[0].id : null,
  );
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
        canEdit={canEdit}
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
                  <Container>
                    <Text c="dimmed" ta="center" pt="lg" pb="sm">
                      {t("no_menu")}
                    </Text>
                    {canCreateMenus && (
                      <Group justify="center">
                        <Button
                          component={Link}
                          href={`/restaurants/${slug}/menus/create`}
                          variant="outline"
                          color="gray"
                          title={t("create_menu")}
                          aria-label={t("create_menu")}
                          rightSection={<IconPlus size={17} />}
                        >
                          {t("create_menu")}
                        </Button>
                      </Group>
                    )}
                  </Container>
                ) : (
                  <Tabs
                    value={activeMenuTabId?.toString() ?? undefined}
                    onChange={(value) => setActiveMenuTabId(Number(value))}
                    variant="default"
                  >
                    <Group justify="space-between" mb="md" wrap="nowrap">
                      <TabsList
                        w="100%"
                        style={{ flexWrap: "nowrap", overflow: "auto" }}
                      >
                        {menus.map((menu) => (
                          <TabsTab key={menu.id} value={menu.id.toString()}>
                            {menu.name}
                          </TabsTab>
                        ))}
                      </TabsList>
                      {(canCreateMenus ||
                        (canEditMenus && activeMenuTabId !== null)) && (
                        <ActionIconGroup>
                          {canEditMenus && activeMenuTabId !== null && (
                            <ActionIcon
                              component={Link}
                              href={`/restaurants/${slug}/menus/${activeMenuTabId}/edit`}
                              variant="outline"
                              color="gray"
                              aria-label={t("edit_menu")}
                              title={t("edit_menu")}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          )}
                          {canCreateMenus && (
                            <ActionIcon
                              component={Link}
                              href={`/restaurants/${slug}/menus/create`}
                              variant="outline"
                              color="gray"
                              title={t("create_menu")}
                              aria-label={t("create_menu")}
                            >
                              <IconPlus size={20} />
                            </ActionIcon>
                          )}
                        </ActionIconGroup>
                      )}
                    </Group>
                    {menus.map((menu) => (
                      <TabsPanel
                        mt="md"
                        key={menu.id}
                        value={menu.id.toString()}
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
