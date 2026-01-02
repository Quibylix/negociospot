import { Alert, Anchor } from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function PoweredByFloating() {
  const t = useTranslations("powered_by");

  return (
    <Alert
      variant="light"
      p="4px 10px"
      radius="xl"
      pos="fixed"
      bottom={10}
      right={10}
      style={{ zIndex: 1000, backdropFilter: "blur(10px)" }}
      icon={<IconBolt />}
      fz="sm"
    >
      {t("text")}{" "}
      <Anchor
        href={process.env.NEXT_PUBLIC_SITE_URL ?? "#"}
        target="_blank"
        fz="inherit"
        fw={700}
      >
        {t("app_name")}
      </Anchor>
      . {t("register_your_business")}
    </Alert>
  );
}
