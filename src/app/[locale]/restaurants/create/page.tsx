import { Container } from "@mantine/core";
import type { Locale } from "next-intl";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { redirect } from "@/features/i18n/navigation/server";
import { Logger } from "@/features/logger/logger";
import { RestaurantForm } from "@/features/restaurants/components/restaurant-form/restaurant-form.component";
import { TagService } from "@/features/tags/service";

export default async function CreateRestaurantPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const user = await AuthService.getCurrentUser().catch((e) => {
    Logger.error("Failed to fetch current user", { error: e });
    return null;
  });

  if (!check(user).can("create", "Restaurant").verify() || !user) {
    redirect({ href: "/", locale });
    return;
  }

  let tags: { id: number; name: string }[];
  try {
    tags = await TagService.getAllTags();
  } catch (e) {
    Logger.error("Failed to fetch tags for restaurant creation", { error: e });
    tags = [];
  }

  return (
    <Container size={1500} py="xl">
      <RestaurantForm mode="create" availableTags={tags} />
    </Container>
  );
}
