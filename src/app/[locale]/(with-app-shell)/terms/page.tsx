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

export default async function TermsPage() {
  const t = await getTranslations("terms");

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
            <Text>{t("s1_text")}</Text>
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
            <List spacing="xs" mt="sm">
              <ListItem>{t("s3_item1")}</ListItem>
              <ListItem>{t("s3_item2")}</ListItem>
              <ListItem>{t("s3_item3")}</ListItem>
            </List>
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
