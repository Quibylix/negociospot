"use client";

import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import {
  createRestaurantBodySchema,
  createRestaurantResponseSchema,
} from "../../schemas/create-restaurant.schema";
import { getValidators } from "./validators";

export function useCreateRestaurantForm() {
  const errorsT = useTranslations("errors");
  const t = useTranslations("create_restaurant.form");
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      address: "",
      coverImgUrl: "",
    },
    validate: getValidators(errorsT),
  });
  const router = useRouter();

  function submitHandler(values: typeof form.values) {
    fetch("/api/v1/restaurants", {
      method: "POST",
      body: JSON.stringify(
        createRestaurantBodySchema.parse({
          name: values.name,
          description: values.description.trim() || undefined,
          address: values.address.trim() || undefined,
          coverImgUrl: values.coverImgUrl.trim() || undefined,
        }),
      ),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => createRestaurantResponseSchema.parseAsync(data))
      .then((data) => {
        if ("id" in data) {
          notifySuccess(t("success_message"), t("success_message"));
          router.replace(`/restaurants/${data.id}`);
          router.refresh();
          return;
        }

        throw new Error();
      })
      .catch(() => {
        notifyError(
          errorsT("generic.unknown_error"),
          errorsT("generic.unknown_error"),
        );
      });
  }

  return { form, t, submitHandler };
}
