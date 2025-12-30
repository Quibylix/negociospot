"use client";

import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Container,
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
import { RestaurantDetailMenu } from "./restaurant-detail-menu.component";

export type RestaurantDetailMenusProps = {
  menus: {
    id: number;
    name: string;
    categories: {
      id: number;
      name: string;
      menuItems: {
        id: number;
        name: string;
        description: string | undefined;
        price: number;
      }[];
    }[];
  }[];
  canCreateMenus: boolean;
  canEditMenus: boolean;
  slug: string;
};

export function RestaurantDetailMenus({
  menus,
  canCreateMenus,
  canEditMenus,
  slug,
}: RestaurantDetailMenusProps) {
  const [activeMenuTabId, setActiveMenuTabId] = useState(
    menus.length > 0 ? menus[0].id : null,
  );

  const t = useTranslations("restaurant.detail");

  return (
    <>
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
            <TabsList w="100%" style={{ flexWrap: "nowrap", overflow: "auto" }}>
              {menus.map((menu) => (
                <TabsTab key={menu.id} value={menu.id.toString()}>
                  {menu.name}
                </TabsTab>
              ))}
            </TabsList>
            {(canCreateMenus || (canEditMenus && activeMenuTabId !== null)) && (
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
            <TabsPanel mt="md" key={menu.id} value={menu.id.toString()}>
              <RestaurantDetailMenu categories={menu.categories} />
            </TabsPanel>
          ))}
        </Tabs>
      )}
    </>
  );
}
