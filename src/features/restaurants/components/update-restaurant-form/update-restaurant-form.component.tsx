"use client";

import {
  ActionIcon,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  GridCol,
  Image,
  MultiSelect,
  Paper,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { MIME_TYPES } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useMemo } from "react";
import { UploadImageField } from "@/features/shared/components/upload-image-field.component";
import { RestaurantDetail } from "../restaurant-detail/restaurant-detail.component";
import { useRestaurantForm } from "../restaurant-form/use-restaurant-form.hook";

export type UpdateRestaurantFormProps = {
  id: number;
  initialValues: {
    name: string;
    description: string;
    address: string;
    coverImgUrl: string;
    tags: number[];
    schedule: string;
    lat: number | null;
    lng: number | null;
  };
  availableTags: { id: number; name: string }[];
};

export function UpdateRestaurantForm({
  id,
  initialValues,
  availableTags,
}: UpdateRestaurantFormProps) {
  const {
    form,
    t,
    submitHandler,
    debouncedValues,
    mapRef,
    clearMarker,
    coverImgUrl,
    dropCoverImgHandler,
    loadingImgCompress,
  } = useRestaurantForm("update", {
    formInitialValues: {
      ...initialValues,
      tags: initialValues.tags.map((tag) => tag.toString()),
    },
    extraInitialValues: {
      coverImgUrl: initialValues.coverImgUrl,
    },
    restaurantId: id,
  });
  const [opened, { open, close }] = useDisclosure(false);

  const tagIdToNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    availableTags.forEach((tag) => {
      map[tag.id.toString()] = tag.name;
    });
    return map;
  }, [availableTags]);

  const restaurantPreview = (
    <RestaurantDetail
      name={debouncedValues.name || t("default_name")}
      lat={debouncedValues.lat ?? undefined}
      lng={debouncedValues.lng ?? undefined}
      description={debouncedValues.description}
      address={debouncedValues.address}
      coverImgUrl={coverImgUrl ? coverImgUrl : undefined}
      tags={debouncedValues.tags.map((tagId) => ({
        id: parseInt(tagId, 10),
        name: tagIdToNameMap[tagId],
      }))}
      reviews={[]}
      menus={[]}
      schedule={debouncedValues.schedule}
      phone=""
      whatsapp=""
      canEdit={false}
      canCreateMenus={false}
      canEditMenus={false}
      slug="preview-restaurant"
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
            <Text size="sm" mt="md" fw={500} mb="xs">
              {t("location_label")}
            </Text>
            <Text size="xs" c="dimmed">
              {t("can_change_location_note")}
            </Text>
            <Container pos="relative" size={400} p={0} mt="xs">
              <ActionIcon
                size="sm"
                variant="filled"
                color="red"
                pos="absolute"
                top={10}
                right={10}
                style={{ zIndex: 1 }}
                onClick={clearMarker}
                title={t("delete_location_button")}
                aria-label={t("delete_location_button")}
              >
                <IconX size={16} />
              </ActionIcon>
              <div style={{ aspectRatio: 1 }} ref={mapRef}></div>
            </Container>
            <TextInput
              label={t("schedule_label")}
              placeholder={t("schedule_placeholder")}
              mt="md"
              {...form.getInputProps("schedule")}
            />
            <Text size="sm" mt="md" fw={500} mb="xs">
              {t("cover_img_label")}
            </Text>
            {coverImgUrl ? (
              <Container pos="relative" p={0}>
                <Image
                  src={coverImgUrl}
                  alt="Cover"
                  radius="md"
                  w="100%"
                  mah={250}
                />
                <ActionIcon
                  size="sm"
                  variant="filled"
                  color="red"
                  pos="absolute"
                  top={8}
                  right={8}
                  onClick={() => dropCoverImgHandler(null)}
                  title={t("remove_image")}
                  aria-label={t("remove_image")}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Container>
            ) : (
              <UploadImageField
                label={t("upload_image_label")}
                labelDescription={t("upload_image_description")}
                name="coverImage"
                multiple={false}
                loading={loadingImgCompress}
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.webp,
                  MIME_TYPES.heic,
                  MIME_TYPES.heif,
                ]}
                onChange={(files) => {
                  dropCoverImgHandler(
                    files && files.length > 0 ? files[0] : null,
                  );
                }}
              />
            )}
            <MultiSelect
              searchable
              limit={10}
              data={availableTags.map((tag) => ({
                value: tag.id.toString(),
                label: tag.name,
              }))}
              label={t("tags_label")}
              placeholder={t("tags_placeholder")}
              mt="md"
              {...form.getInputProps("tags")}
            />
            <Button type="submit" fullWidth mt="lg">
              {t("edition_submit_button")}
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
