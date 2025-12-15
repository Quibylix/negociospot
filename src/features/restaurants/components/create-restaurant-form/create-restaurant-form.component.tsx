"use client";

import {
  Box,
  Button,
  Grid,
  GridCol,
  Paper,
  Textarea,
  TextInput,
} from "@mantine/core";
import { RestaurantDetail } from "../restaurant-detail/restaurant-detail.component";
import { useCreateRestaurantForm } from "./use-create-restaurant-form.hook";

export function CreateRestaurantForm() {
  const { form, t, submitHandler, debouncedValues } = useCreateRestaurantForm();

  return (
    <Box pos="relative">
      <form onSubmit={form.onSubmit(submitHandler)}>
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 4 }}>
            <Paper withBorder shadow="md" p="md" radius="md">
              <TextInput
                label={t("name_label")}
                placeholder={t("name_placeholder")}
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
              <Textarea
                label={t("description_label")}
                placeholder={t("description_placeholder")}
                mt="md"
                key={form.key("description")}
                {...form.getInputProps("description")}
              />
              <TextInput
                label={t("address_label")}
                placeholder={t("address_placeholder")}
                mt="md"
                key={form.key("address")}
                {...form.getInputProps("address")}
              />
              <TextInput
                label={t("cover_img_url_label")}
                placeholder={t("cover_img_url_placeholder")}
                mt="md"
                key={form.key("coverImgUrl")}
                {...form.getInputProps("coverImgUrl")}
              />
            </Paper>
          </GridCol>
          <GridCol span={{ base: 12, md: 8 }}>
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
          </GridCol>
        </Grid>
        <Box
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <Button type="submit" size="lg">
            {t("submit_button")}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
