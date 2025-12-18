"use client";

import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import {
  createMenuBodySchema,
  createMenuResponseSchema,
} from "../../schemas/create-menu.schema";
import { getValidators } from "./validators";

export function useCreateMenuForm(restaurantSlug: string) {
  const errorsT = useTranslations("errors");
  const t = useTranslations("create_menu.form");
  const form = useForm<{
    name: string;
    categories: {
      key: string;
      name: string;
      items: {
        key: string;
        name: string;
        description?: string;
        price: number;
      }[];
    }[];
  }>({
    initialValues: {
      name: "",
      categories: [],
    },
    validate: getValidators(errorsT),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(values: typeof form.values) {
    setIsLoading(true);

    // Multitply item prices by 100 to get cents
    const parsedValues = await createMenuBodySchema
      .parseAsync({
        name: values.name,
        categories: values.categories.map((category) => ({
          name: category.name,
          items: category.items.map((item) => ({
            name: item.name,
            description: item.description,
            price: item.price * 100,
          })),
        })),
      })
      .catch(() => {
        notifyError(
          errorsT("generic.unknown_error"),
          errorsT("generic.unknown_error"),
        );
        setIsLoading(false);
        return null;
      });

    if (!parsedValues) return;

    fetch(`/api/v1/restaurants/${restaurantSlug}/menus`, {
      method: "POST",
      body: JSON.stringify(parsedValues),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => createMenuResponseSchema.parse(data))
      .then((data) => {
        if ("error" in data) {
          notifyError(errorsT(data.error), errorsT(data.error));
          return;
        }

        notifySuccess(t("success_message"), t("success_message"));
        router.replace(`/restaurants/${restaurantSlug}`);
        router.refresh();
      })
      .catch(() => {
        notifyError(
          errorsT("generic.unknown_error"),
          errorsT("generic.unknown_error"),
        );
      })
      .finally(() => setIsLoading(false));
  }

  return { form, t, submitHandler, isLoading };
}
