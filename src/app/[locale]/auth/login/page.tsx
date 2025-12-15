import { Anchor, Container, Text, Title } from "@mantine/core";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/login-form/login-form.component";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Link } from "@/features/i18n/navigation";
import { redirect } from "@/features/i18n/navigation/server";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const user = await AuthService.getCurrentUser();

  if (!check(user).can("create", "Session").verify()) {
    redirect({ href: "/", locale });
  }

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
