import {
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/features/i18n/navigation";
import styles from "./restaurant-card.module.css";

export type RestaurantCardProps = {
  name: string;
  slug: string;
  address: string | null;
  description: string | null;
  coverImgUrl: string | null;
  tags: { id: number; name: string }[];
};

export async function RestaurantCard({
  name,
  slug,
  address,
  description,
  coverImgUrl,
  tags,
}: RestaurantCardProps) {
  const t = await getTranslations("restaurant.card");

  return (
    <Card
      className={styles.card}
      component={Link}
      href={`/restaurants/${slug}`}
      shadow="sm"
      px="lg"
      py="md"
      radius="md"
      withBorder
    >
      <Stack align="stretch" gap="md" h="100%">
        <CardSection w="100%" h={200} m={0} pos="relative" flex="0 0 auto">
          <Image
            src={coverImgUrl || "https://placehold.co/600x400"}
            width={600}
            height={400}
            style={{ aspectRatio: "3 / 2" }}
            w="100%"
            h="auto"
            mih="100%"
            mah="100%"
            fit="cover"
            alt={name}
            radius="md"
          />
        </CardSection>
        <Box p="sm" flex={1}>
          <Group justify="space-between" align="start">
            <Title order={3} fw={700} lineClamp={1} size="lg">
              {name}
            </Title>
          </Group>
          <Group gap={5} mt={5} c="dimmed" wrap="nowrap">
            <IconMapPin size={16} />
            <Text lineClamp={1} size="sm">
              {address || "Sin dirección"}
            </Text>
          </Group>
          {description && (
            <Text size="sm" mt="sm" lineClamp={1}>
              {description}
            </Text>
          )}
          {tags.length > 0 && (
            <Group gap="xs" mt="sm">
              {tags.map((t) => (
                <Badge key={t.id} color="gray">
                  {t.name}
                </Badge>
              ))}
            </Group>
          )}
        </Box>
        <Button component="div">{t("view_restaurant")}</Button>
      </Stack>
    </Card>
  );
}
