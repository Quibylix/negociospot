import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/features/i18n/navigation";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  if (!t) {
    notFound();
  }

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "";
  const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent(t("mailto_subject"))}&body=${encodeURIComponent(t("mailto_body"))}`;

  return (
    <Container size="lg" py={50}>
      <Stack gap={50} align="center" ta="center">
        <Title>{t("title")}</Title>
        <Text c="dimmed" maw={600}>
          {t("description")}
        </Text>
        <Button
          component={Link}
          href={mailtoHref}
          leftSection={<IconMail size={16} />}
          maw="100%"
          radius="md"
          mih="max-content"
          h="auto"
          p="xs"
        >
          {t("mailto_cta")}:<br />
          {supportEmail}
        </Button>
      </Stack>
    </Container>
  );
}
