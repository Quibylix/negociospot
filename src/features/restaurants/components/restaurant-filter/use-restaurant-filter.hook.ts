import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "@/features/i18n/navigation";
import { notifyError } from "@/features/notifications/notify";
import {
  LATITUDE_SEARCH_PARAM,
  LONGITUDE_SEARCH_PARAM,
  QUERY_SEARCH_PARAM,
  RADIUS_KM_SEARCH_PARAM,
  TAGS_SEARCH_PARAM,
} from "./search-params.constant";

const DEBOUNCE_DELAY_MS = 600;

export function useRestaurantFilter(initialValues: {
  query?: string;
  tags?: string[];
  location?: { lat: number; lng: number };
  radiusInKm?: number;
}) {
  const t = useTranslations("restaurants.filter");
  const router = useRouter();
  const pathname = usePathname();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm({
    initialValues: {
      query: initialValues.query || "",
      tags: initialValues.tags || [],
      location: initialValues.location || null,
      radiusInKm: initialValues.radiusInKm || 10,
    },
    onValuesChange(values) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams();

        const { query, tags, location, radiusInKm } = values;

        if (query.trim()) params.set(QUERY_SEARCH_PARAM, query);
        if (tags.length > 0) params.set(TAGS_SEARCH_PARAM, tags.join(","));

        if (location) {
          params.set(LATITUDE_SEARCH_PARAM, location.lat.toString());
          params.set(LONGITUDE_SEARCH_PARAM, location.lng.toString());
          params.set(RADIUS_KM_SEARCH_PARAM, radiusInKm.toString());
        }

        router.push(`${pathname}?${params.toString()}`);
      }, DEBOUNCE_DELAY_MS);
    },
  });

  const [isFiltersOpen, { toggle: toggleFilters }] = useDisclosure(false);
  const [isMapOpen, { open: openMap, close: closeMap }] = useDisclosure(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    const { query, tags, location, radiusInKm } = form.getValues();

    if (query.trim()) params.set(QUERY_SEARCH_PARAM, query);
    if (tags.length > 0) params.set(TAGS_SEARCH_PARAM, tags.join(","));

    if (location) {
      params.set(LATITUDE_SEARCH_PARAM, location.lat.toString());
      params.set(LONGITUDE_SEARCH_PARAM, location.lng.toString());
      params.set(RADIUS_KM_SEARCH_PARAM, radiusInKm.toString());
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    form.setValues({
      query: "",
      tags: [],
      location: null,
      radiusInKm: 10,
    });
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
        form.setFieldValue("location", {
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

  return {
    t,
    form,
    isFiltersOpen,
    toggleFilters,
    isMapOpen,
    openMap,
    closeMap,
    isLoadingGeo,
    handleSearch,
    handleClear,
    handleNearMe,
  };
}
