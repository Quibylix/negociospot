"use client";

import { type UseFormReturnType, useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import { useMapPicker } from "@/lib/google-maps/use-map-picker.hook";
import { compressImage } from "@/lib/images/compress-image.util";
import { uploadImage } from "@/lib/supabase/utils/upload-image.util";
import {
  createRestaurantBodySchema,
  createRestaurantResponseSchema,
} from "../../schemas/create-restaurant.schema";
import {
  updateRestaurantBodySchema,
  updateRestaurantResponseSchema,
} from "../../schemas/update-restaurant.schema";
import { getValidators } from "./validators";

export type RestaurantFormMode = "create" | "update";
export type RestaurantFormData = {
  formInitialValues: {
    name: string;
    description: string;
    address: string;
    schedule: string;
    tags: string[];
    lat: number | null;
    lng: number | null;
  };
  extraInitialValues: {
    coverImgUrl: string;
  };
  restaurantId: number;
};

export type UseRestaurantFormReturnType = {
  form: UseFormReturnType<RestaurantFormData["formInitialValues"]>;
  t: ReturnType<typeof useTranslations>;
  submitHandler: (
    values: RestaurantFormData["formInitialValues"],
  ) => Promise<void>;
  debouncedValues: RestaurantFormData["formInitialValues"];
  clearMarker: () => void;
  mapRef: React.RefObject<HTMLDivElement | null>;
  coverImgUrl: string;
  loadingImgCompress: boolean;
  dropCoverImgHandler: (file: File | null) => Promise<void>;
};

export function useRestaurantForm(mode: "create"): UseRestaurantFormReturnType;
export function useRestaurantForm(
  mode: "update",
  data: RestaurantFormData,
): UseRestaurantFormReturnType;
export function useRestaurantForm(
  mode: RestaurantFormMode,
  data?: RestaurantFormData,
): UseRestaurantFormReturnType {
  const { formInitialValues, extraInitialValues, restaurantId } = data ?? {
    formInitialValues: {
      name: "",
      description: "",
      address: "",
      schedule: "",
      lat: null,
      lng: null,
      tags: [],
    },
    extraInitialValues: {
      coverImgUrl: "",
    },
  };

  const errorsT = useTranslations("errors");
  const t = useTranslations("create_restaurant.form");

  const [debouncedValues, setDebouncedValues] = useDebouncedState(
    formInitialValues,
    300,
  );

  const form = useForm({
    initialValues: formInitialValues,
    validate: getValidators(errorsT),
    onValuesChange: (values) => {
      setDebouncedValues(values);
    },
  });

  const [loadingImgCompress, setLoadingImgCompress] = useState(false);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [coverImgUrl, setCoverImgUrl] = useState(
    extraInitialValues.coverImgUrl || "",
  );

  const { mapRef, clearMarker } = useMapPicker({
    center: {
      lat: formInitialValues.lat ?? 13.7,
      lng: formInitialValues.lng ?? -88.9,
    },
    initiallySelectedPosition:
      formInitialValues.lat && formInitialValues.lng
        ? {
            lat: formInitialValues.lat,
            lng: formInitialValues.lng,
          }
        : undefined,
    onChange: (pos) => {
      form.setFieldValue("lat", pos?.lat ?? null);
      form.setFieldValue("lng", pos?.lng ?? null);
    },
  });

  const router = useRouter();

  async function dropCoverImgHandler(file: File | null) {
    setLoadingImgCompress(true);

    if (!file) {
      setCoverImg(null);
      setCoverImgUrl("");
      setLoadingImgCompress(false);
      return;
    }

    const compressed = await compressImage(file).catch(() =>
      notifyError(
        errorsT("image.upload_failed"),
        errorsT("image.upload_failed"),
      ),
    );

    setCoverImg(compressed ? compressed : null);
    setCoverImgUrl(compressed ? URL.createObjectURL(compressed) : "");
    setLoadingImgCompress(false);
  }

  async function submitHandler(values: typeof form.values) {
    const finalCoverImgUrl = coverImg
      ? await uploadImage(coverImg)
          .then(({ data, error }) => {
            if (error) return null;
            return data.publicUrl;
          })
          .catch(() => {
            return null;
          })
      : null;

    if (coverImg && !finalCoverImgUrl) {
      notifyError(
        errorsT("image.upload_failed"),
        errorsT("image.upload_failed"),
      );
      return;
    }

    const isUpdateMode = mode === "update";
    const endpoint = isUpdateMode
      ? `/api/v1/restaurants/${restaurantId}`
      : "/api/v1/restaurants";
    const method = isUpdateMode ? "PUT" : "POST";
    const bodySchema = isUpdateMode
      ? updateRestaurantBodySchema
      : createRestaurantBodySchema;
    const responseSchema = isUpdateMode
      ? updateRestaurantResponseSchema
      : createRestaurantResponseSchema;

    await fetch(endpoint, {
      method: method,
      body: JSON.stringify(
        bodySchema.parse({
          name: values.name,
          description: values.description.trim() || undefined,
          schedule: values.schedule.trim() || undefined,
          address: values.address.trim() || undefined,
          coverImgUrl: finalCoverImgUrl,
          lat: values.lat ?? undefined,
          lng: values.lng ?? undefined,
          tagIds: values.tags.map((tag) => Number(tag)),
        }),
      ),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => responseSchema.parseAsync(data))
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

  return {
    form,
    t,
    submitHandler,
    debouncedValues,
    clearMarker,
    mapRef,
    coverImgUrl,
    loadingImgCompress,
    dropCoverImgHandler,
  };
}
