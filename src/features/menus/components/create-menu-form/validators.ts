import { formRootRule } from "@mantine/form";
import type { useTranslations } from "next-intl";
import { z } from "zod";
import type { FormValidators } from "@/features/shared/types/form-validator";
import { schemaToValidator } from "@/lib/zod/schema-to-validator.util";

export const getValidators = (
  t: ReturnType<typeof useTranslations<"errors">>,
): FormValidators => ({
  name: schemaToValidator(
    z.string(t("menus.name_required")).min(1, t("menus.name_required")),
  ),
  categories: {
    [formRootRule]: schemaToValidator(
      z
        .array(z.unknown(), t("menus.at_least_one_category"))
        .min(1, t("menus.at_least_one_category")),
    ),
    name: schemaToValidator(
      z
        .string(t("menus.category_name_required"))
        .min(1, t("menus.category_name_required")),
    ),
    items: {
      [formRootRule]: schemaToValidator(
        z
          .array(z.unknown(), t("menus.at_least_one_item"))
          .min(1, t("menus.at_least_one_item")),
      ),
      name: schemaToValidator(
        z
          .string(t("menus.item_name_required"))
          .min(1, t("menus.item_name_required")),
      ),
      price: schemaToValidator(
        z
          .number(t("menus.item_price_required"))
          .min(0, t("menus.item_price_required")),
      ),
    },
  },
});
