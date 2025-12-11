import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/features/i18n/navigation";

export default async function VerifyEmailPage() {
  const t = await getTranslations("confirm_email");

  return (
    <Container size="sm" my="xl">
      <Paper withBorder shadow="md" p="lg" radius="md" mt="xl">
        <Center>
          <IconMail
            style={{ width: rem(50), height: rem(50) }}
            color="var(--mantine-color-blue-6)"
          />
        </Center>

        <Title ta="center" mt="md" mb="sm">
          {t("title")}
        </Title>

        <Text c="dimmed" size="sm" ta="center">
          {t("description")}
        </Text>

        <Text c="dimmed" size="xs" ta="center" mt="sm">
          {t("not_found")}
        </Text>

        <Group justify="center" mt="xl">
          <Button component={Link} href="/auth/login">
            {t("go_back")}
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
