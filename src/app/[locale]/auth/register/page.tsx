import { Anchor, Container, Text, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/features/auth/components/register-form/register-form.component";
import { Link } from "@/features/i18n/navigation";

export default async function RegisterPage() {
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
