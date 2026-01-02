"use client";

import { Button } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useFavoriteRestaurantButton } from "./use-favorite-restaurant-button.hook";

export function FavoriteRestaurantButton({
  isFavorite,
  restaurantSlug,
}: {
  isFavorite: boolean;
  restaurantSlug: string;
}) {
  const t = useTranslations("restaurant.favorite");
  const { isFavorite: favoriteState, toggleFavorite } =
    useFavoriteRestaurantButton({
      isFavorite,
      restaurantSlug,
    });

  return (
    <Button
      variant="outline"
      color="red"
      onClick={toggleFavorite}
      leftSection={
        favoriteState ? <IconHeartFilled size={20} /> : <IconHeart size={20} />
      }
    >
      {favoriteState ? t("remove_favorite") : t("add_favorite")}
    </Button>
  );
}
