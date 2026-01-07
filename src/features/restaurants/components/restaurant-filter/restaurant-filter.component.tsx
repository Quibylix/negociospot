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
  LoadingOverlay,
  Modal,
  MultiSelect,
  RangeSlider,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCurrentLocation,
  IconFilter,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/features/i18n/navigation";
import { notifyError } from "@/features/notifications/notify";
import { MapPicker } from "@/lib/google-maps/map-picker.component";
import {
  LATITUDE_SEARCH_PARAM,
  LONGITUDE_SEARCH_PARAM,
  QUERY_SEARCH_PARAM,
  RADIUS_KM_SEARCH_PARAM,
  TAGS_SEARCH_PARAM,
} from "./search-params.constant";

interface RestaurantsFilterProps {
  availableTags: { id: number; name: string }[];
}

export function RestaurantsFilter({ availableTags }: RestaurantsFilterProps) {
  const t = useTranslations("restaurants.filter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [radius, setRadius] = useState<number>(10);

  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, { toggle: toggleFilters }] = useDisclosure(false);
  const [isMapOpen, { open: openMap, close: closeMap }] = useDisclosure(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  useEffect(() => {
    const pQuery = searchParams.get(QUERY_SEARCH_PARAM);
    const pTags = searchParams.get(TAGS_SEARCH_PARAM);
    const pLat = searchParams.get(LATITUDE_SEARCH_PARAM);
    const pLng = searchParams.get(LONGITUDE_SEARCH_PARAM);
    const pRadius = searchParams.get(RADIUS_KM_SEARCH_PARAM);

    if (pQuery) setQuery(pQuery);
    if (pTags) setSelectedTags(pTags.split(","));
    if (pLat && pLng) {
      setLocation({ lat: parseFloat(pLat) || 0, lng: parseFloat(pLng) || 0 });
    }
    if (pRadius) setRadius(parseInt(pRadius, 10) || 10);

    setLoading(false);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) params.set(QUERY_SEARCH_PARAM, query);
    if (selectedTags.length > 0)
      params.set(TAGS_SEARCH_PARAM, selectedTags.join(","));

    if (location) {
      params.set(LATITUDE_SEARCH_PARAM, location.lat.toString());
      params.set(LONGITUDE_SEARCH_PARAM, location.lng.toString());
      params.set(RADIUS_KM_SEARCH_PARAM, radius.toString());
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedTags([]);
    setLocation(null);
    setRadius(10);
    router.push(pathname);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      notifyError(
        t("geolocation_not_supported"),
        t("geolocation_not_supported"),
      );
      return;
    }

    setIsLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingGeo(false);
      },
      () => {
        notifyError(t("geolocation_error"), t("geolocation_error"));
        setIsLoadingGeo(false);
      },
    );
  };

  return (
    <Card withBorder shadow="sm" radius="md" mb="xl">
      <LoadingOverlay visible={loading} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <Grid align="end" gutter="md">
          <GridCol span={{ base: 12, md: 5 }}>
            <TextInput
              label={t("search_label")}
              placeholder={t("search_placeholder")}
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
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
              value={selectedTags}
              onChange={setSelectedTags}
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
                  onClick={() => setLocation(null)}
                >
                  {t("clear_location")}
                </Button>
              )}
            </Group>

            {location && (
              <Flex align="center" gap="sm" flex={1}>
                <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                  {t("radius_label")}: {radius} km
                </Text>
                <RangeSlider
                  min={1}
                  max={50}
                  step={1}
                  value={[0, radius]}
                  onChange={(val) => setRadius(val[1])}
                  label={null}
                  flex={1}
                  color="blue"
                  thumbSize={14}
                  onChangeEnd={(val) => setRadius(val[1])}
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

      {(query || selectedTags.length > 0 || location) && (
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
          value={location}
          onChange={(val) => setLocation(val)}
          defaultCenter={location || undefined}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={closeMap}>{t("confirm_location_button")}</Button>
        </Group>
      </Modal>
    </Card>
  );
}
