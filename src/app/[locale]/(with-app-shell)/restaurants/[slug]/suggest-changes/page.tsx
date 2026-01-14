import { Container } from "@mantine/core";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { redirect } from "@/features/i18n/navigation/server";
import { Logger } from "@/features/logger/logger";
import { RestaurantForm } from "@/features/restaurants/components/restaurant-form/restaurant-form.component";
import { RestaurantsService } from "@/features/restaurants/service";
import { TagService } from "@/features/tags/service";

export default async function SuggestRestaurantChangesPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;

  const user = await AuthService.getCurrentUser().catch((e) => {
    Logger.error("Failed to fetch current user", { error: e });
    return null;
  });
  const restaurantAdmins = await RestaurantsService.getRestaurantAdminsBySlug(
    slug,
  )
    .then((res) => res?.administrators.map((admin) => admin.profile.id) ?? [])
    .catch((e) => {
      Logger.error("Failed to fetch restaurant admins", {
        restaurantSlug: slug,
        error: e,
      });
      return null;
    });

  if (restaurantAdmins === null) {
    redirect({ href: "/", locale });
    return;
  }

  const restaurant = await RestaurantsService.getRestaurantBySlug(slug).catch(
    (error) => {
      Logger.warn(`Restaurant with slug "${slug}" not found.`, error);
      return null;
    },
  );

  if (!restaurant) {
    notFound();
  }

  if (
    !check(user)
      .can("suggestChanges", "Restaurant")
      .verify({
        creatorId: restaurant.createdById ?? null,
        admins: restaurantAdmins,
      }) ||
    !user
  ) {
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
      <RestaurantForm
        mode="suggest_changes"
        id={restaurant.id}
        initialValues={{
          name: restaurant.name,
          description: restaurant.description ?? "",
          address: restaurant.address ?? "",
          coverImgUrl: restaurant.coverImgUrl ?? "",
          schedule: restaurant.schedule ?? "",
          phone: restaurant.phone ?? "",
          whatsapp: restaurant.whatsapp ?? "",
          tags: restaurant.tags.map((tag) => tag.id),
          lat: restaurant.lat,
          lng: restaurant.lng,
        }}
        availableTags={tags}
      />
    </Container>
  );
}
