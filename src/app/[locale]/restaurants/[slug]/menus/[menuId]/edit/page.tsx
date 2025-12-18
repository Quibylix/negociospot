import { Container, Title } from "@mantine/core";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { redirect } from "@/features/i18n/navigation/server";
import { Logger } from "@/features/logger/logger";
import { UpdateMenuForm } from "@/features/menus/components/update-menu-form/update-menu-form.component";
import {
  checkMenuBelongsToRestaurant,
  getMenuById,
} from "@/features/menus/service";
import { RestaurantsService } from "@/features/restaurants/service";

export default async function UpdateMenuPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale; menuId: string }>;
}) {
  const { slug, locale, menuId } = await params;

  if (Number.isNaN(Number(menuId))) {
    return redirect({ href: `/restaurants/${slug}`, locale });
  }

  const t = await getTranslations("update_menu").catch((error) => {
    Logger.error("Error fetching translations", { error, locale });
    return redirect({ href: `/restaurants/${slug}`, locale });
  });

  const user = await AuthService.getCurrentUser().catch((error) => {
    Logger.warn("Error fetching current user", { error });
    return redirect({ href: `/restaurants/${slug}`, locale });
  });

  const admins = await RestaurantsService.getRestaurantAdminsBySlug(slug).catch(
    (error) => {
      Logger.error("Error fetching restaurant admins", { error, slug });
      return redirect({ href: `/restaurants/${slug}`, locale });
    },
  );

  if (admins === null)
    return redirect({ href: `/restaurants/${slug}`, locale });

  const belongsToRestaurant = await checkMenuBelongsToRestaurant(
    Number(menuId),
    slug,
  ).catch(() => {
    Logger.error("Failed to verify menu ownership", {
      menuId,
      restaurantSlug: slug,
    });
    return redirect({ href: `/restaurants/${slug}`, locale });
  });

  if (
    !check(user)
      .can("edit", "Menu")
      .verify({
        restaurantAdmins: admins.administrators.map(
          (admin) => admin.profile.id,
        ),
        belongsToRestaurant,
      })
  ) {
    return redirect({ href: `/restaurants/${slug}`, locale });
  }

  const menuData = await getMenuById(Number(menuId)).catch((error) => {
    Logger.error("Error fetching menu data", { error, id: menuId });
    return redirect({ href: `/restaurants/${slug}`, locale });
  });

  if (menuData === null) {
    return redirect({ href: `/restaurants/${slug}`, locale });
  }

  return (
    <Container size="md" py="xl">
      <Title mb="lg">{t("title")}</Title>
      <UpdateMenuForm
        initialValues={{
          ...menuData,
          categories: menuData.categories.map((category) => ({
            id: category.id,
            name: category.name,
            items: category.menuItems.map((item) => ({
              ...item,
              description: item.description ?? undefined,
              price: item.price / 100,
            })),
          })),
        }}
        restaurantSlug={slug}
        id={Number(menuId)}
      />
    </Container>
  );
}
