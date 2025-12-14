import { Card, Group, Stack, Text, Title } from "@mantine/core";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailMenuProps = {
  categories: RestaurantDetailProps["menus"][0]["categories"];
};

export function RestaurantDetailMenu({
  categories,
}: RestaurantDetailMenuProps) {
  return (
    <Stack gap="xl">
      {categories.map((cat) => (
        <div key={cat.id}>
          <Title order={3} size="h4" mb="sm" c="dimmed" tt="uppercase">
            {cat.name}
          </Title>
          <Stack gap="sm">
            {cat.menuItems.map((item) => (
              <Card key={item.id} withBorder shadow="xs" padding="sm">
                <Group justify="space-between" align="start">
                  <div>
                    <Text fw={600}>{item.name}</Text>
                    {item.description && (
                      <Text size="xs" c="dimmed">
                        {item.description}
                      </Text>
                    )}
                  </div>
                  <Text fw={700}>${(item.price / 100).toFixed(2)}</Text>
                </Group>
              </Card>
            ))}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
