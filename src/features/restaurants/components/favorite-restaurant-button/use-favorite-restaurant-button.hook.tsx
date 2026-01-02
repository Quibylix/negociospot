import { ResultAsync } from "neverthrow";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { notifyError } from "@/features/notifications/notify";
import { ERRORS } from "@/features/shared/constants/errors";
import { favoriteRestaurantResponseSchema } from "../../schemas/favorite-restaurant.schema";

export function useFavoriteRestaurantButton({
  isFavorite: initialIsFavorite,
  restaurantSlug,
}: {
  isFavorite: boolean;
  restaurantSlug: string;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const t = useTranslations("restaurant.favorite");
  const errorT = useTranslations("errors");

  const controllerRef = useRef<AbortController | null>(null);

  async function toggleFavorite() {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const previousIsFavorite = isFavorite;
    const nextIsFavorite = !isFavorite;

    setIsFavorite(nextIsFavorite);

    const endpoint = `/api/v1/restaurants/${restaurantSlug}/favorites`;
    const method = nextIsFavorite ? "POST" : "DELETE";

    controllerRef.current = new AbortController();

    const responseResult = await ResultAsync.fromThrowable(() =>
      fetch(endpoint, { method, signal: controllerRef.current?.signal })
        .then((res) => res.json())
        .then((data) => favoriteRestaurantResponseSchema.parseAsync(data)),
    )();

    if (responseResult.isErr()) {
      if (
        responseResult.error instanceof Error &&
        responseResult.error.name === "AbortError"
      ) {
        return;
      }

      setIsFavorite(previousIsFavorite);
      notifyError(errorT("generic.unknown_error"), t("toggle_error"));
      return;
    }

    const response = responseResult.value;
    const silentSuccessMessage = nextIsFavorite
      ? ERRORS.RESTAURANTS.ALREADY_FAVORITED
      : ERRORS.RESTAURANTS.NOT_FAVORITED_FOUND;

    if (response?.error && response.error !== silentSuccessMessage) {
      setIsFavorite(previousIsFavorite);
      notifyError(errorT(response.error), errorT(response.error));
      return;
    }
  }

  return { isFavorite, toggleFavorite };
}
