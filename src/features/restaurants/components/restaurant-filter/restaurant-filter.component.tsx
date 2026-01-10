"use client";

import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  MultiSelect,
  RangeSlider,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconCurrentLocation,
  IconFilter,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { MapPicker } from "@/lib/google-maps/map-picker.component";
import { useRestaurantFilter } from "./use-restaurant-filter.hook";

interface RestaurantsFilterProps {
  initialValues: {
    query?: string;
    tags?: string[];
    location?: { lat: number; lng: number };
    radiusInKm?: number;
  };
  availableTags: { id: number; name: string }[];
}

export function RestaurantsFilter({
  initialValues,
  availableTags,
}: RestaurantsFilterProps) {
  const {
    form,
    t,
    isFiltersOpen,
    toggleFilters,
    isMapOpen,
    openMap,
    closeMap,
    isLoadingGeo,
    handleNearMe,
    handleSearch,
    handleClear,
  } = useRestaurantFilter(initialValues);

  const { query, tags, location, radiusInKm } = form.getValues();

  return (
    <Card withBorder shadow="sm" radius="md" mb="xl">
      <form onSubmit={form.onSubmit(handleSearch)}>
        <Grid align="end" gutter="md">
          <GridCol span={{ base: 12, md: 5 }}>
            <TextInput
              label={t("search_label")}
              placeholder={t("search_placeholder")}
              leftSection={<IconSearch size={16} />}
              {...form.getInputProps("query")}
            />
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <MultiSelect
              label={t("tags_label")}
              placeholder={t("tags_placeholder")}
              limit={50}
              data={availableTags.map((t) => ({
                value: t.id.toString(),
                label: t.name,
              }))}
              {...form.getInputProps("tags")}
              searchable
              maxValues={3}
              hidePickedOptions
            />
          </GridCol>

          <GridCol span={{ base: 12, md: 3 }}>
            <Group gap="xs" grow>
              <Button type="submit" variant="filled" color="primary">
                {t("search_button")}
              </Button>
              <Tooltip label={t("advanced_filters")}>
                <ActionIcon
                  variant={isFiltersOpen ? "light" : "default"}
                  size="lg"
                  onClick={toggleFilters}
                  color={location ? "blue" : "gray"}
                >
                  <IconFilter size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </GridCol>
        </Grid>
      </form>

      <Collapse in={isFiltersOpen} mt={isFiltersOpen ? "md" : 0}>
        <Card withBorder radius="md" bg="gray.0" p="sm">
          <Text size="sm" fw={500} mb="xs">
            {t("location_filter_title")}
          </Text>

          <Flex
            gap="md"
            direction={{ base: "column", sm: "row" }}
            align={{ sm: "center" }}
          >
            <Group>
              <Button
                leftSection={<IconCurrentLocation size={16} />}
                variant="light"
                size="xs"
                loading={isLoadingGeo}
                onClick={handleNearMe}
              >
                {t("near_me_button")}
              </Button>
              <Button
                leftSection={<IconMapPin size={16} />}
                variant="outline"
                size="xs"
                onClick={openMap}
              >
                {location
                  ? t("change_location_button")
                  : t("select_on_map_button")}
              </Button>
              {location && (
                <Button
                  leftSection={<IconX size={16} />}
                  variant="subtle"
                  color="red"
                  size="xs"
                  onClick={() => form.setFieldValue("location", null)}
                >
                  {t("clear_location")}
                </Button>
              )}
            </Group>

            {location && (
              <Flex align="center" gap="sm" flex={1}>
                <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                  {t("radius_label")}: {radiusInKm} km
                </Text>
                <RangeSlider
                  min={1}
                  max={50}
                  step={1}
                  value={[0, radiusInKm]}
                  onChange={(val) => form.setFieldValue("radiusInKm", val[1])}
                  label={null}
                  flex={1}
                  color="blue"
                  thumbSize={14}
                  onChangeEnd={(val) =>
                    form.setFieldValue("radiusInKm", val[1])
                  }
                  minRange={0}
                />
              </Flex>
            )}
          </Flex>
          {location && (
            <Text size="xs" c="dimmed" mt="xs">
              {t("selected_coordinates")}: {location.lat.toFixed(4)},{" "}
              {location.lng.toFixed(4)}
            </Text>
          )}
        </Card>
      </Collapse>

      {(query || tags.length > 0 || location) && (
        <Group justify="flex-end" mt="xs">
          <Button variant="subtle" color="gray" size="xs" onClick={handleClear}>
            {t("clear_all_filters")}
          </Button>
        </Group>
      )}

      <Modal
        opened={isMapOpen}
        onClose={closeMap}
        title={t("select_location_modal_title")}
        size="lg"
        centered
      >
        <MapPicker
          {...form.getInputProps("location")}
          defaultCenter={location || undefined}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={closeMap}>{t("confirm_location_button")}</Button>
        </Group>
      </Modal>
    </Card>
  );
}
