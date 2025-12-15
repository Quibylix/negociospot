"use client";

import {
  Box,
  Button,
  Drawer,
  Grid,
  GridCol,
  Paper,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RestaurantDetail } from "../restaurant-detail/restaurant-detail.component";
import { useCreateRestaurantForm } from "./use-create-restaurant-form.hook";

export function CreateRestaurantForm() {
  const { form, t, submitHandler, debouncedValues } = useCreateRestaurantForm();
  const [opened, { open, close }] = useDisclosure(false);

  const restaurantPreview = (
    <RestaurantDetail
      name={debouncedValues.name || t("default_name")}
      description={debouncedValues.description}
      address={debouncedValues.address}
      coverImgUrl={debouncedValues.coverImgUrl}
      tags={[]}
      reviews={[]}
      menus={[]}
      schedule=""
      phone=""
      whatsapp=""
    />
  );

  return (
    <Box pos="relative">
      <Grid gutter="xl">
        <GridCol span={{ base: 12, lg: 4 }}>
          <Paper
            component="form"
            onSubmit={form.onSubmit(submitHandler)}
            withBorder
            shadow="md"
            p="md"
            radius="md"
          >
            <Title order={2} mb="md">
              {t("form_title")}
            </Title>
            <TextInput
              label={t("name_label")}
              placeholder={t("name_placeholder")}
              {...form.getInputProps("name")}
            />
            <Textarea
              label={t("description_label")}
              placeholder={t("description_placeholder")}
              mt="md"
              {...form.getInputProps("description")}
            />
            <TextInput
              label={t("address_label")}
              placeholder={t("address_placeholder")}
              mt="md"
              {...form.getInputProps("address")}
            />
            <TextInput
              label={t("cover_img_url_label")}
              placeholder={t("cover_img_url_placeholder")}
              mt="md"
              {...form.getInputProps("coverImgUrl")}
            />
            <Button type="submit" fullWidth mt="lg">
              {t("submit_button")}
            </Button>
          </Paper>
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }} visibleFrom="lg">
          <Title order={2} mb="md">
            {t("preview_title")}
          </Title>
          {restaurantPreview}
        </GridCol>
      </Grid>
      <Drawer
        hiddenFrom="lg"
        opened={opened}
        onClose={close}
        title={t("preview_title")}
        size="xl"
        position="right"
      >
        {restaurantPreview}
      </Drawer>
      <Box
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        hiddenFrom="lg"
      >
        <Button
          display={opened ? "none" : undefined}
          onClick={open}
          variant="outline"
          style={{ marginRight: 10 }}
        >
          {t("show_preview_button")}
        </Button>
      </Box>
    </Box>
  );
}
