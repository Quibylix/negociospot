"use client";

import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import {
  updateMenuBodySchema,
  updateMenuResponseSchema,
} from "../../schemas/update-menu.schema";
import { getValidators } from "./validators";

export type UpdateMenuInitialValues = {
  name: string;
  categories: {
    id?: number;
    name: string;
    items: {
      id?: number;
      name: string;
      description?: string;
      price: number;
    }[];
  }[];
};

export function useUpdateMenuForm(
  initialValues: UpdateMenuInitialValues,
  restaurantSlug: string,
  id: number,
) {
  const errorsT = useTranslations("errors");
  const t = useTranslations("update_menu.form");
  const form = useForm<{
    name: string;
    categories: {
      key: string;
      id?: number;
      name: string;
      items: {
        key: string;
        id?: number;
        name: string;
        description?: string;
        price: number;
      }[];
    }[];
  }>({
    initialValues: {
      ...initialValues,
      categories: initialValues.categories.map((category) => ({
        ...category,
        key: randomId(),
        items: category.items.map((item) => ({
          ...item,
          key: randomId(),
        })),
      })),
    },
    validate: getValidators(errorsT),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(values: typeof form.values) {
    setIsLoading(true);

    // Multitply item prices by 100 to get cents
    const parsedValues = await updateMenuBodySchema
      .parseAsync({
        name: values.name,
        categories: values.categories.map((category) => ({
          id: category.id,
          name: category.name,
          items: category.items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Math.round(item.price * 100),
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

    fetch(`/api/v1/restaurants/${restaurantSlug}/menus/${id}`, {
      method: "PUT",
      body: JSON.stringify(parsedValues),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => updateMenuResponseSchema.parse(data))
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
