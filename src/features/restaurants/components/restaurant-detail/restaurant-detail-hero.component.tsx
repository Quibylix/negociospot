"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Container,
  Group,
  Image,
  Rating,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/features/i18n/navigation";
import { FavoriteRestaurantButton } from "../favorite-restaurant-button/favorite-restaurant-button.component";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailHeroProps = {
  restaurant: {
    coverImgUrl: RestaurantDetailProps["coverImgUrl"];
    name: RestaurantDetailProps["name"];
    tags: RestaurantDetailProps["tags"];
    slug: string;
    reviewsCount: number;
    isFavorite: boolean;
    ratingAvg: number;
    isClaimed: boolean;
  };
  allowedActions: {
    canEdit: boolean;
    canFavorite: boolean;
    canSuggestChanges: boolean;
    canSeeReviews: boolean;
  };
};

export function RestaurantDetailHero({
  restaurant: {
    coverImgUrl,
    name,
    tags,
    reviewsCount,
    ratingAvg,
    slug,
    isFavorite,
    isClaimed,
  },
  allowedActions: { canEdit, canFavorite, canSuggestChanges, canSeeReviews },
}: RestaurantDetailHeroProps) {
  const t = useTranslations("restaurant.detail");

  return (
    <Box maw={1200} m="auto">
      <Image
        src={coverImgUrl || "https://placehold.co/1200x400?text=Cover"}
        style={{ aspectRatio: "8 / 3" }}
        h="auto"
        w="100%"
        fit="cover"
        alt="Cover"
      />
      <Container size="lg" pos="relative">
        <Card shadow="md" radius="md" p="lg" pos="relative" top={-40} mb={-40}>
          <Group justify="space-between" align="start">
            <div>
              <Group align="center">
                <Title textWrap="wrap" order={1}>
                  {name}
                </Title>
                {isClaimed && (
                  <Tooltip
                    label={t("claimed")}
                    withArrow
                    events={{ hover: true, focus: true, touch: true }}
                  >
                    <ThemeIcon ml={-5} color="blue" variant="transparent">
                      <IconRosetteDiscountCheckFilled size={30} />
                    </ThemeIcon>
                  </Tooltip>
                )}
                {canEdit && (
                  <ActionIcon
                    component={Link}
                    href={`/restaurants/${slug}/edit`}
                    variant="outline"
                    color="gray"
                    title={t("edit_restaurant")}
                    aria-label={t("edit_restaurant")}
                  >
                    <IconEdit size={20} />
                  </ActionIcon>
                )}
                {canSuggestChanges && (
                  <ActionIcon
                    component={Link}
                    href={`/restaurants/${slug}/suggest-changes`}
                    variant="outline"
                    color="gray"
                    title={t("suggest_changes")}
                    aria-label={t("suggest_changes")}
                  >
                    <IconEdit size={20} />
                  </ActionIcon>
                )}
              </Group>
              <Group gap="xs" mt={5}>
                {tags.map((t) => (
                  <Badge key={t.id} color="gray">
                    {t.name}
                  </Badge>
                ))}
              </Group>
            </div>
            {canSeeReviews && (
              <Stack gap={0} align="center">
                <Group gap={5}>
                  <Text fw={700} size="xl">
                    {ratingAvg.toFixed(1)}
                  </Text>
                  <Rating value={ratingAvg} readOnly fractions={2} />
                </Group>
                <Text size="sm" c="dimmed">
                  {t("reviews_count", { count: reviewsCount })}
                </Text>
              </Stack>
            )}
            {canFavorite && (
              <FavoriteRestaurantButton
                isFavorite={isFavorite}
                restaurantSlug={slug}
              />
            )}
          </Group>
        </Card>
      </Container>
    </Box>
  );
}
