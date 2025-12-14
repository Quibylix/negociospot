import { Container, Stack } from "@mantine/core";
import { RestaurantCard } from "@/features/restaurants/components/restaurant-card/restaurant-card.component";
import { RestaurantsService } from "@/features/restaurants/service";
import { PaginationControl } from "@/features/shared/components/pagination-control.component";
import { PAGE_SEARCH_PARAM } from "@/features/shared/constants/page-search-param.constant";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [PAGE_SEARCH_PARAM]: string }>;
}) {
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
    <Container size="lg" py="xl">
      <Stack gap="lg">
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
      </Stack>
      {totalPages > 1 && <PaginationControl totalPages={totalPages} />}
    </Container>
  );
}
