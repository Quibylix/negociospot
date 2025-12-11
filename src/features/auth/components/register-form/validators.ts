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
      .string("auth.password_required")
      .min(6, t("auth.password_too_short"))
      .max(100, t("auth.password_too_long")),
  ),
  confirmPassword: (value, values) => {
    if (
      typeof values !== "object" ||
      values === null ||
      !("password" in values)
    ) {
      return t("auth.confirm_password_required");
    }

    if (value !== values.password) {
      return t("auth.passwords_do_not_match");
    }

    return null;
  },
});
