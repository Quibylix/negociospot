import type { getTranslations } from "next-intl/server";

export function generateFooterLinks(
  t: Awaited<ReturnType<typeof getTranslations<"footer">>>,
) {
  return [
    {
      title: t("about_us"),
      links: [
        { label: t("faq"), href: "/faq" },
        { label: t("contact"), href: "/contact" },
        { label: t("blog"), href: "/blog" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("terms"), href: "/terms" },
        { label: t("privacy"), href: "/privacy" },
      ],
    },
  ];
}
