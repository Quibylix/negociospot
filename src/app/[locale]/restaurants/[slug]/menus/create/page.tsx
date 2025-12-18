import { Container, Title } from "@mantine/core";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { redirect } from "@/features/i18n/navigation/server";
import { Logger } from "@/features/logger/logger";
import { CreateMenuForm } from "@/features/menus/components/create-menu-form/create-menu-form.component";
import { RestaurantsService } from "@/features/restaurants/service";

export default async function CreateMenuPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("create_menu").catch((error) => {
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

  if (
    !check(user)
      .can("create", "Menu")
      .verify({
        admins: admins.administrators.map((admin) => admin.profile.id),
      })
  ) {
    return redirect({ href: `/restaurants/${slug}`, locale });
  }

  return (
    <Container size="md" py="xl">
      <Title mb="lg">{t("title")}</Title>
      <CreateMenuForm restaurantSlug={slug} />
    </Container>
  );
}
