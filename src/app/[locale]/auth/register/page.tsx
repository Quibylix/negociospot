import { Anchor, Container, Text, Title } from "@mantine/core";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/features/auth/components/register-form/register-form.component";
import { AuthService } from "@/features/auth/service";
import { getUserAbility } from "@/features/auth/utils/permissions.util";
import { Link } from "@/features/i18n/navigation";
import { redirect } from "@/features/i18n/navigation/server";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const user = await AuthService.getCurrentUser();
  const ability = getUserAbility(user ? { id: user.id } : null);

  if (ability.cannot("create", "Session")) {
    redirect({ href: "/", locale });
  }

  const t = await getTranslations("register");

  return (
    <Container size="xl" py="xl">
      <Container size="xs">
        <Title mb="md" ta="center">
          {t("title")}
        </Title>
        <Text c="dimmed" fz="sm" ta="center" mb="xl">
          {t("already_an_account")}{" "}
          <Anchor component={Link} href="/auth/login" fz="inherit">
            {t("login_here")}
          </Anchor>
        </Text>
        <RegisterForm />
      </Container>
    </Container>
  );
}
