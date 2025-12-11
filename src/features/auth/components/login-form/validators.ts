import type { useTranslations } from "next-intl";
import z from "zod";
import type { FormValidators } from "@/features/shared/types/form-validator";
import { schemaToValidator } from "@/lib/zod/schema-to-validator.util";

export const getValidators = (
  t: ReturnType<typeof useTranslations<"errors">>,
): FormValidators => ({
  email: schemaToValidator(z.email(t("auth.invalid_email"))),
  password: schemaToValidator(
    z
      .string()
      .min(6, t("auth.password_too_short"))
      .max(100, t("auth.password_too_long")),
  ),
});
