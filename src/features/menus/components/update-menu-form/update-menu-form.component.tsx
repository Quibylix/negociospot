"use client";

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  type UpdateMenuInitialValues,
  useUpdateMenuForm,
} from "./use-update-menu-form.hook";

export function UpdateMenuForm({
  initialValues,
  restaurantSlug,
  id,
}: {
  initialValues: UpdateMenuInitialValues;
  restaurantSlug: string;
  id: number;
}) {
  const { t, form, isLoading, submitHandler } = useUpdateMenuForm(
    initialValues,
    restaurantSlug,
    id,
  );

  return (
    <Paper
      component="form"
      withBorder
      p="lg"
      radius="md"
      onSubmit={form.onSubmit(submitHandler)}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
      <Stack>
        <TextInput
          label={t("name_label")}
          placeholder={t("name_placeholder")}
          withAsterisk
          {...form.getInputProps("name")}
        />

        <Divider label={t("categories")} labelPosition="left" />

        {form.errors.categories && (
          <Text fz="sm" c="red">
            {form.errors.categories}
          </Text>
        )}
        {form.values.categories.map((cat, i) => (
          <Paper key={cat.key} withBorder p="md" radius="md" bg="gray.0">
            <Group mb="sm">
              <TextInput
                placeholder={t("category_placeholder")}
                style={{ flex: 1 }}
                {...form.getInputProps(`categories.${i}.name`)}
              />
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => {
                  form.removeListItem("categories", i);
                }}
                aria-label={t("delete_category_aria_label")}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            <Stack gap="xs" pl="md" style={{ borderLeft: "2px solid #e9ecef" }}>
              {form.errors[`categories.${i}.items`] && (
                <Text fz="sm" c="red">
                  {form.errors[`categories.${i}.items`]}
                </Text>
              )}
              {cat.items.map((item, j) => (
                <Group
                  key={item.key}
                  mb="xs"
                  wrap="nowrap"
                  align="center"
                  style={{ overflow: "auto" }}
                >
                  <Group align="flex-start" gap="xs" flex={1}>
                    <TextInput
                      miw={150}
                      placeholder={t("item_name_placeholder")}
                      style={{ flex: 2 }}
                      {...form.getInputProps(`categories.${i}.items.${j}.name`)}
                    />
                    <TextInput
                      miw={150}
                      placeholder={t("item_description_placeholder")}
                      style={{ flex: 2 }}
                      {...form.getInputProps(
                        `categories.${i}.items.${j}.description`,
                      )}
                    />
                    <NumberInput
                      miw={100}
                      placeholder={t("item_price_placeholder")}
                      min={0}
                      decimalScale={2}
                      fixedDecimalScale
                      hideControls
                      style={{ flex: 1 }}
                      {...form.getInputProps(
                        `categories.${i}.items.${j}.price`,
                      )}
                    />
                  </Group>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    mt={4}
                    onClick={() => {
                      form.removeListItem(`categories.${i}.items`, j);
                    }}
                    aria-label={t("delete_item_aria_label")}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="white"
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => {
                  form.insertListItem(`categories.${i}.items`, {
                    name: "",
                    price: 0,
                    description: "",
                    key: randomId(),
                  });
                  form.setFieldError(`categories.${i}.items`, undefined);
                }}
              >
                {t("add_item_button")}
              </Button>
            </Stack>
          </Paper>
        ))}

        <Button
          variant="default"
          onClick={() => {
            form.insertListItem("categories", {
              key: randomId(),
              name: "",
              items: [{ name: "", price: 0, description: "", key: randomId() }],
            });
            form.setFieldError("categories", undefined);
          }}
          leftSection={<IconPlus size={14} />}
        >
          {t("add_category_button")}
        </Button>

        <Button type="submit" mt="md" disabled={isLoading} loading={isLoading}>
          {t("submit_button")}
        </Button>
      </Stack>
    </Paper>
  );
}
