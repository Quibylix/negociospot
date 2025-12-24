"use client";

import { useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import { useMapPicker } from "@/lib/google-maps/use-map-picker.hook";
import {
  createRestaurantBodySchema,
  createRestaurantResponseSchema,
} from "../../schemas/create-restaurant.schema";
import { getValidators } from "./validators";

export function useCreateRestaurantForm() {
  const errorsT = useTranslations("errors");
  const t = useTranslations("create_restaurant.form");

  const initialValues = {
    name: "",
    description: "",
    address: "",
    schedule: "",
    coverImgUrl: "",
    lat: null as number | null,
    lng: null as number | null,
    tags: [] as string[],
  };

  const [debouncedValues, setDebouncedValues] = useDebouncedState(
    { ...initialValues, tags: [] as string[] },
    300,
  );

  const form = useForm({
    initialValues,
    validate: getValidators(errorsT),
    onValuesChange: (values) => {
      setDebouncedValues(values);
    },
  });

  const { mapRef, clearMarker } = useMapPicker({
    center: {
      lat: initialValues.lat ?? 13.7,
      lng: initialValues.lng ?? -88.9,
    },
    initiallySelectedPosition:
      initialValues.lat && initialValues.lng
        ? {
            lat: initialValues.lat,
            lng: initialValues.lng,
          }
        : undefined,
    onChange: (pos) => {
      form.setFieldValue("lat", pos?.lat ?? null);
      form.setFieldValue("lng", pos?.lng ?? null);
    },
  });

  const router = useRouter();

  function submitHandler(values: typeof form.values) {
    fetch("/api/v1/restaurants", {
      method: "POST",
      body: JSON.stringify(
        createRestaurantBodySchema.parse({
          name: values.name,
          description: values.description.trim() || undefined,
          schedule: values.schedule.trim() || undefined,
          address: values.address.trim() || undefined,
          coverImgUrl: values.coverImgUrl.trim() || undefined,
          lat: values.lat ?? undefined,
          lng: values.lng ?? undefined,
          tagIds: values.tags.map((tag) => Number(tag)),
        }),
      ),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => createRestaurantResponseSchema.parseAsync(data))
      .then((data) => {
        if ("slug" in data) {
          notifySuccess(t("success_message"), t("success_message"));
          router.replace(`/restaurants/${data.slug}`);
          router.refresh();
          return;
        }

        notifyError(errorsT(data.error), errorsT(data.error));
      })
      .catch(() => {
        notifyError(
          errorsT("generic.unknown_error"),
          errorsT("generic.unknown_error"),
        );
      });
  }

  return { form, t, submitHandler, debouncedValues, clearMarker, mapRef };
}
