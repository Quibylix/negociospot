import type { getTranslations } from "next-intl/server";

export function generateNavbarLinks(
  t: Awaited<ReturnType<typeof getTranslations<"app_shell.navbar">>>,
) {
  return {
    HOME: { label: t("home"), href: "/" },
    LOGIN: { label: t("login"), href: "/auth/login" },
    REGISTER: { label: t("register"), href: "/auth/register" },
    CREATE_RESTAURANT: {
      label: t("create_restaurant"),
      href: "/restaurants/create",
    },
  };
}
