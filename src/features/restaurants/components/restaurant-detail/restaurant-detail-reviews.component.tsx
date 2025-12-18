"use client";

import { Alert, Avatar, Card, Group, Rating, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailReviewsProps = {
  reviews: RestaurantDetailProps["reviews"];
};

export function RestaurantDetailReviews({
  reviews,
}: RestaurantDetailReviewsProps) {
  const t = useTranslations("restaurant.detail");

  return (
    <Stack gap="md">
      {reviews.map((rev) => (
        <Card key={rev.id} withBorder padding="sm">
          <Group mb="xs">
            <Avatar color="blue" radius="xl">
              {rev.profile.email[0]?.toUpperCase() || "U"}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {rev.title}
              </Text>
              <Rating value={rev.rating} readOnly size="xs" />
            </div>
          </Group>
          <Text size="sm">{rev.comment}</Text>
        </Card>
      ))}
      {reviews.length === 0 && <Alert ta="center">{t("reviews_soon")}</Alert>}
    </Stack>
  );
}
