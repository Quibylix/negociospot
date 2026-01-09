import {
  Card,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  Text,
} from "@mantine/core";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailMenuProps = {
  categories: RestaurantDetailProps["menus"][0]["categories"];
};

export function RestaurantDetailMenu({
  categories,
}: RestaurantDetailMenuProps) {
  return (
    <Stack gap="xl">
      <Tabs
        defaultValue={categories[0]?.id.toString()}
        styles={{ list: { flexWrap: "nowrap" } }}
      >
        <ScrollArea offsetScrollbars>
          <TabsList>
            {categories.map((cat) => (
              <Tabs.Tab key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </Tabs.Tab>
            ))}
          </TabsList>
        </ScrollArea>
        {categories.map((cat) => (
          <TabsPanel key={cat.id} value={cat.id.toString()}>
            <Stack gap="sm" mt="md">
              {cat.menuItems.map((item) => (
                <Card key={item.id} withBorder shadow="xs" padding="sm">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <ScrollArea
                      type="hover"
                      scrollbarSize={6}
                      offsetScrollbars="present"
                    >
                      <div>
                        <Text fw={600}>{item.name}</Text>
                        {item.description && (
                          <Text size="xs" c="dimmed">
                            {item.description}
                          </Text>
                        )}
                      </div>
                    </ScrollArea>
                    <Text fw={700}>${(item.price / 100).toFixed(2)}</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </TabsPanel>
        ))}
      </Tabs>
    </Stack>
  );
}
