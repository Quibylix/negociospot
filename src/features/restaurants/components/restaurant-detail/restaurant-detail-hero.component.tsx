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
  Title,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/features/i18n/navigation";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailHeroProps = {
  coverImgUrl: RestaurantDetailProps["coverImgUrl"];
  name: RestaurantDetailProps["name"];
  tags: RestaurantDetailProps["tags"];
  reviewsCount: number;
  ratingAvg: number;
  canEdit: boolean;
  slug: string;
};

export function RestaurantDetailHero({
  coverImgUrl,
  name,
  tags,
  reviewsCount,
  ratingAvg,
  slug,
  canEdit,
}: RestaurantDetailHeroProps) {
  const t = useTranslations("restaurant.detail");

  return (
    <Box h={300} style={{ position: "relative" }}>
      <Image
        src={coverImgUrl || "https://placehold.co/1200x400?text=Cover"}
        h="100%"
        w="100%"
        fit="cover"
        alt="Cover"
      />
      <Container
        size="lg"
        style={{ position: "absolute", bottom: -40, left: 0, right: 0 }}
      >
        <Card shadow="md" radius="md" p="lg">
          <Group justify="space-between" align="start">
            <div>
              <Group align="center">
                <Title order={1}>{name}</Title>
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
              </Group>
              <Group gap="xs" mt={5}>
                {tags.map((t) => (
                  <Badge key={t.id} color="gray">
                    {t.name}
                  </Badge>
                ))}
              </Group>
            </div>
            <Stack gap={0} align="end">
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
          </Group>
        </Card>
      </Container>
    </Box>
  );
}
