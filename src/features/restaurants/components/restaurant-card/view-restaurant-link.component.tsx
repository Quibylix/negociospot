"use client";

import { Button } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Link } from "@/features/i18n/navigation";

export function ViewRestaurantLink({ slug }: { slug: string }) {
  const t = useTranslations("restaurant.card");

  return (
    <Button component={Link} href={`/restaurants/${slug}`} variant="light">
      {t("view_restaurant")}
    </Button>
  );
}
