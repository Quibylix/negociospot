import {
  Container,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <Container size="md" py={60}>
      <Paper shadow="none">
        <Stack gap="xl">
          <header>
            <Title order={1}>{t("title")}</Title>
            <Text size="sm" c="dimmed" mt={5}>
              {t("lastUpdate")}
            </Text>
          </header>

          <Divider />

          <Text style={{ lineHeight: 1.8 }}>{t("intro")}</Text>

          <section>
            <Title order={3} mb="sm">
              {t("s1_title")}
            </Title>
            <Text mb="md">{t("s1_text")}</Text>
            <List spacing="xs">
              <ListItem>{t("s1_item1")}</ListItem>
              <ListItem>{t("s1_item2")}</ListItem>
              <ListItem>{t("s1_item3")}</ListItem>
              <ListItem>{t("s1_item4")}</ListItem>
            </List>
          </section>

          <section>
            <Title order={3} mb="sm">
              {t("s2_title")}
            </Title>
            <Text>{t("s2_text")}</Text>
          </section>

          <section>
            <Title order={3} mb="sm">
              {t("s3_title")}
            </Title>
            <Text>{t("s3_text")}</Text>
          </section>

          <section>
            <Title order={3} mb="sm">
              {t("s4_title")}
            </Title>
            <Text>{t("s4_text")}</Text>
          </section>

          <section>
            <Title order={3} mb="sm">
              {t("s5_title")}
            </Title>
            <Text>{t("s5_text")}</Text>
          </section>
        </Stack>
      </Paper>
    </Container>
  );
}
