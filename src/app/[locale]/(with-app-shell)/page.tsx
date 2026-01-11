import {
  Button,
  Container,
  Group,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ResultAsync } from "neverthrow";
import { getTranslations } from "next-intl/server";
import z from "zod";
import { Link } from "@/features/i18n/navigation";
import { Logger } from "@/features/logger/logger";
import { RestaurantCard } from "@/features/restaurants/components/restaurant-card/restaurant-card.component";
import { RestaurantsFilter } from "@/features/restaurants/components/restaurant-filter/restaurant-filter.component";
import {
  LATITUDE_SEARCH_PARAM,
  LONGITUDE_SEARCH_PARAM,
  QUERY_SEARCH_PARAM,
  RADIUS_KM_SEARCH_PARAM,
  TAGS_SEARCH_PARAM,
} from "@/features/restaurants/components/restaurant-filter/search-params.constant";
import { getRestaurantsWithCount } from "@/features/restaurants/service";
import { PaginationControl } from "@/features/shared/components/pagination-control.component";
import { PAGE_SEARCH_PARAM } from "@/features/shared/constants/page-search-param.constant";
import { TagService } from "@/features/tags/service";
import hero from "@/media/imgs/hero.webp";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    [PAGE_SEARCH_PARAM]: string;
    [QUERY_SEARCH_PARAM]?: string;
    [TAGS_SEARCH_PARAM]?: string;
    [LATITUDE_SEARCH_PARAM]?: string;
    [LONGITUDE_SEARCH_PARAM]?: string;
    [RADIUS_KM_SEARCH_PARAM]?: string;
  }>;
}) {
  const t = await getTranslations("home");

  const searchParamsResolved = await searchParams;
  let page = Number(searchParamsResolved[PAGE_SEARCH_PARAM]) || 1;
  if (page < 1) page = 1;
  const pageSize = 9;

  const {
    [QUERY_SEARCH_PARAM]: query,
    [TAGS_SEARCH_PARAM]: tags,
    [LATITUDE_SEARCH_PARAM]: latitude,
    [LONGITUDE_SEARCH_PARAM]: longitude,
    [RADIUS_KM_SEARCH_PARAM]: radiusKm,
  } = searchParamsResolved;

  const tagsIdsResult = z
    .array(z.int())
    .safeParse(tags ? tags.split(",").map((t) => Number(t)) : []);

  const locationResult = z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      radiusKm: z.number().min(0),
    })
    .safeParse({
      lat: Number(latitude),
      lng: Number(longitude),
      radiusKm: Number(radiusKm),
    });

  const restaurantResults = await getRestaurantsWithCount({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    filters: {
      query,
      tagIds: tagsIdsResult.success ? tagsIdsResult.data : undefined,
      location: locationResult.success ? locationResult.data : undefined,
    },
  });

  if (restaurantResults.isErr()) {
    return null;
  }

  const restaurants = restaurantResults.value.restaurants.slice(0, pageSize);
  const totalPages = Math.ceil(restaurantResults.value.totalCount / pageSize);

  const availableTags = await ResultAsync.fromThrowable(() =>
    TagService.getAllTags(),
  )()
    .mapErr((e) => {
      Logger.error("Failed to fetch tags for restaurant creation", {
        error: e,
      });
    })
    .unwrapOr([]);

  return (
    <Container fluid p={0}>
      <Group
        align="center"
        pos="relative"
        p={0}
        mb="xl"
        bg={`url(${hero.src}) no-repeat center / cover`}
        w="100%"
        style={{
          aspectRatio: hero.width / hero.height,
        }}
        mah={400}
      >
        <Stack
          align="center"
          justify="center"
          w="100%"
          h="100%"
          mih="max-content"
          p="lg"
          style={{
            backdropFilter: "brightness(0.8)",
          }}
        >
          <Title
            fz={{
              base: rem(32),
              sm: rem(32),
              md: rem(48),
            }}
            ta="center"
            h="max-content"
            c="primary.5"
            style={{
              textTransform: "capitalize",
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.7))",
            }}
          >
            {t("welcome_message")}
          </Title>{" "}
          <Text
            fz={{ base: rem(18), md: rem(22) }}
            mx="auto"
            ta="center"
            c="gray.1"
            w={rem(600)}
            maw="90%"
            style={{
              filter: "drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.7))",
            }}
          >
            {t("hero_subtitle")}
          </Text>
          <Button
            size="md"
            component={Link}
            href="/restaurants/create"
            variant="filled"
            color="teal"
          >
            {t("register_business_cta")}
          </Button>
        </Stack>
      </Group>
      <Container size="lg">
        <RestaurantsFilter
          initialValues={{
            query: query,
            tags: tagsIdsResult.data?.map((tg) => String(tg)) ?? [],
            location: locationResult.success
              ? {
                  lat: locationResult.data.lat,
                  lng: locationResult.data.lng,
                }
              : undefined,
            radiusInKm: locationResult.data?.radiusKm,
          }}
          availableTags={availableTags}
        />
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
              isClaimed={r._count.administrators > 0}
              tags={r.tags.map((t) => ({ id: t.id, name: t.name }))}
            />
          ))}
        </SimpleGrid>
        {totalPages > 1 && <PaginationControl totalPages={totalPages} />}
      </Container>
    </Container>
  );
}
