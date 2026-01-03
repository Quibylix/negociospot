import { Container, rem, SimpleGrid, Text, Title } from "@mantine/core";
import { IconHeartFilled, IconHeartPlus } from "@tabler/icons-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AuthService } from "@/features/auth/service";
import { redirect } from "@/features/i18n/navigation/server";
import { RestaurantCard } from "@/features/restaurants/components/restaurant-card/restaurant-card.component";
import {
  getFavoriteRestaurants,
  getFavoriteRestaurantsCount,
} from "@/features/restaurants/service";
import { PaginationControl } from "@/features/shared/components/pagination-control.component";
import { PAGE_SEARCH_PARAM } from "@/features/shared/constants/page-search-param.constant";

export default async function FavoritesRestaurantsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [PAGE_SEARCH_PARAM]: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("restaurants.favorites");

  const searchParamsResolved = await searchParams;
  let page = Number(searchParamsResolved[PAGE_SEARCH_PARAM]) || 1;
  if (page < 1) page = 1;
  const pageSize = 9;

  const user = await AuthService.getCurrentUser().catch(() => null);

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const totalCountResult = await getFavoriteRestaurantsCount({
    userId: user.id,
  });

  if (totalCountResult.isErr()) {
    redirect({ href: "/login", locale });
    return null;
  }

  const totalCount = totalCountResult.value;

  const restaurantsResult = await getFavoriteRestaurants({
    userId: user.id,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  if (restaurantsResult.isErr()) {
    redirect({ href: "/login", locale });
    return null;
  }

  const restaurants = restaurantsResult.value;

  const totalPages = Math.ceil(totalCount / pageSize);

  // const yourFavorites = t("title");
  // const noFavorites = t("no_favorites");
  // const addToFavorites = t("add_to_favorites");
  // Leaving space for a tabler icon

  return (
    <Container fluid p={0}>
      {totalCount === 0 ? (
        <Container size="lg" py="xl">
          <Title
            fz={{
              base: rem(18),
              sm: rem(24),
              md: rem(32),
            }}
            ta="center"
            mb="xl"
          >
            {t("no_favorites")}
          </Title>
          <IconHeartPlus
            size={64}
            style={{ display: "block", margin: "0 auto" }}
            color="gray"
          />
          <Text ta="center" mt="md" c="dimmed">
            {t("add_to_favorites")}
          </Text>
        </Container>
      ) : (
        <Container size="lg" py="xl">
          <Title
            fz={{
              base: rem(24),
              sm: rem(32),
              md: rem(48),
            }}
            ta="center"
            mb="md"
            display="flex"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {t("title")}
            <IconHeartFilled size={48} style={{ marginLeft: 10 }} color="red" />
          </Title>
          <Text ta="center" mb="xl" c="dimmed">
            {t("subtitle")}
          </Text>
          <SimpleGrid
            cols={{
              base: 1,
              xs: 2,
              lg: 3,
            }}
          >
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.id}
                name={r.name}
                slug={r.slug}
                address={r.address}
                description={r.description}
                coverImgUrl={r.coverImgUrl}
                tags={r.tags.map((t) => ({ id: t.id, name: t.name }))}
              />
            ))}
          </SimpleGrid>
          {totalPages > 1 && <PaginationControl totalPages={totalPages} />}
        </Container>
      )}
    </Container>
  );
}
