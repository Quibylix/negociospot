import { Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main>
      <Title>{t("title")}</Title>
    </main>
  );
}
