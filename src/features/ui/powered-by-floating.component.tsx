import { Affix, Alert, Anchor, Group, Text, ThemeIcon } from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function PoweredByFloating() {
  const t = useTranslations("powered_by");

  return (
    <Affix position={{ bottom: 10, right: 10 }} zIndex={1000}>
      <Alert
        variant="light"
        p="xs"
        radius="xl"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <Group wrap="nowrap" gap={5}>
          <ThemeIcon variant="transparent">
            <IconBolt size={20} />
          </ThemeIcon>
          <Text fz="sm">
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
          </Text>
        </Group>
      </Alert>
    </Affix>
  );
}
