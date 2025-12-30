import { Container, Image, rem, SimpleGrid, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { RestaurantCard } from "@/features/restaurants/components/restaurant-card/restaurant-card.component";
import { RestaurantsService } from "@/features/restaurants/service";
import { PaginationControl } from "@/features/shared/components/pagination-control.component";
import { PAGE_SEARCH_PARAM } from "@/features/shared/constants/page-search-param.constant";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [PAGE_SEARCH_PARAM]: string }>;
}) {
  const t = await getTranslations("home");

  const searchParamsResolved = await searchParams;
  let page = Number(searchParamsResolved[PAGE_SEARCH_PARAM]) || 1;
  if (page < 1) page = 1;
  const pageSize = 9;

  const { restaurants, totalCount } =
    await RestaurantsService.getRestaurantsWithCount({
      page,
      pageSize,
    });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Container fluid p={0}>
      <Container pos="relative" fluid p={0}>
        <Image
          style={{ filter: "brightness(0.65)" }}
          src="/hero.webp"
          alt="Hero Image"
          mb="xl"
          radius="md"
          mah={300}
        />
        <Title
          fz={{
            base: rem(24),
            sm: rem(32),
            md: rem(48),
          }}
          w="max-content"
          h="max-content"
          pos="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          m="auto"
          c="primary.5"
          style={{
            textTransform: "capitalize",
            zIndex: 1,
            filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.7))",
          }}
        >
          {t("welcome_message")}
        </Title>
      </Container>
      <Container size="lg" py="xl">
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
    </Container>
  );
}
