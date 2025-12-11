import { Anchor, Container, Text, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/login-form/login-form.component";
import { Link } from "@/features/i18n/navigation";

export default async function LoginPage() {
  const t = await getTranslations("login");

  return (
    <Container size="xl" py="xl">
      <Container size="xs">
        <Title mb="md" ta="center">
          {t("title")}
        </Title>
        <Text c="dimmed" fz="sm" ta="center" mb="xl">
          {t("no_account")}{" "}
          <Anchor component={Link} href="/auth/register" fz="inherit">
            {t("create_account")}
          </Anchor>
        </Text>
        <LoginForm />
      </Container>
    </Container>
  );
}
