import type { useTranslations } from "next-intl";
import type { FormValidators } from "@/features/shared/types/form-validator";

export function getValidators(
  errorsT: ReturnType<typeof useTranslations<"errors">>,
): FormValidators {
  return {
    name: (value) => (!value ? errorsT("restaurants.name_required") : null),
  };
}
