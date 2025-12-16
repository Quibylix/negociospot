import {
  Badge,
  Card,
  CardSection,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { ViewRestaurantLink } from "./view-restaurant-link.component";

export type RestaurantCardProps = {
  name: string;
  slug: string;
  address: string | null;
  description: string | null;
  coverImgUrl: string | null;
  tags: { id: number; name: string }[];
};

export function RestaurantCard({
  name,
  slug,
  address,
  description,
  coverImgUrl,
  tags,
}: RestaurantCardProps) {
  return (
    <Card shadow="sm" px="lg" py="md" radius="md" withBorder>
      <Flex direction={{ base: "column", sm: "row" }} align="stretch" gap="md">
        <CardSection
          w={{ base: "100%", sm: 250 }}
          h={{ base: 200, sm: "auto" }}
          m={0}
          pos="relative"
          flex="0 0 auto"
        >
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
        <Stack justify="space-between" flex={1} mih="100%" p="sm">
          <div>
            <Group justify="space-between" align="start">
              <Title order={3} fw={700} lineClamp={1} size="lg">
                {name}
              </Title>
              {tags[0] && <Badge color="green">{tags[0].name}</Badge>}
            </Group>
            <Group gap={5} mt={5} c="dimmed" wrap="nowrap">
              <IconMapPin size={16} />
              <Text lineClamp={1} size="sm">
                {address || "Sin dirección"}
              </Text>
            </Group>
            <Text size="sm" mt="sm" lineClamp={2}>
              {description}
            </Text>
          </div>
          <Group justify="flex-end" mt={{ base: "md", sm: 0 }}>
            <ViewRestaurantLink slug={slug} />
          </Group>
        </Stack>
      </Flex>
    </Card>
  );
}
