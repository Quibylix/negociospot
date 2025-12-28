import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridCol,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconEye, IconHeart, IconRocket, IconUsers } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/features/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <Container size="lg" py={50}>
      <Stack gap={50}>
        <Box ta="center">
          <Text
            gradient={{ from: "blue", to: "cyan" }}
            component={Title}
            variant="gradient"
          >
            {t("title")}
          </Text>
          <Text size="xl" c="dimmed" mt="md" maw={800} mx="auto">
            {t("description")}
          </Text>
        </Box>
        <Grid gutter={40} align="center">
          <GridCol span={{ base: 12, md: 6 }}>
            <Title order={2} mb="md">
              {t("why_title")}
            </Title>
            <Text mb="sm">{t("why_text_1")}</Text>
            <Text>{t("why_text_2")}</Text>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Card shadow="md" radius="lg" p="xl" withBorder>
              <Title order={3} mb="xs">
                {t("mission_title")}
              </Title>
              <Text c="dimmed">{t("mission_text")}</Text>
            </Card>
          </GridCol>
        </Grid>
        <Divider label="Nuestros Pilares" labelPosition="center" />
        <Grid>
          {[
            {
              title: t("pillars.community.title"),
              desc: t("pillars.community.desc"),
              icon: IconUsers,
              color: "blue",
            },
            {
              title: t("pillars.transparency.title"),
              desc: t("pillars.transparency.desc"),
              icon: IconEye,
              color: "teal",
            },
            {
              title: t("pillars.innovation.title"),
              desc: t("pillars.innovation.desc"),
              icon: IconRocket,
              color: "orange",
            },
            {
              title: t("pillars.passion.title"),
              desc: t("pillars.passion.desc"),
              icon: IconHeart,
              color: "red",
            },
          ].map((item) => (
            <GridCol key={item.title} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card shadow="sm" radius="md" p="lg" withBorder h="100%">
                <ThemeIcon
                  size={50}
                  radius="md"
                  variant="light"
                  color={item.color}
                  mb="md"
                >
                  <item.icon size={30} />
                </ThemeIcon>
                <Text fw={700} size="lg" mb="xs">
                  {item.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {item.desc}
                </Text>
              </Card>
            </GridCol>
          ))}
        </Grid>
        <Stack align="center" ta="center" gap="md">
          <Title order={2}>{t("more_than_food_title")}</Title>
          <Text maw={700}>{t("more_than_food_text")}</Text>
        </Stack>
        <Card bg="blue.0" p={40} radius="lg" ta="center">
          <Stack align="center">
            <Title order={3}>{t("business_owner_cta_title")}</Title>
            <Text>{t("business_owner_cta_text")}</Text>
            <Button
              component={Link}
              href="/restaurants/create"
              size="lg"
              radius="md"
              color="blue"
            >
              {t("business_owner_cta_button")}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
