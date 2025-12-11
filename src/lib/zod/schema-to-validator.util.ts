import type z from "zod";
import type { FormValidator } from "@/features/shared/types/form-validator";

export function schemaToValidator(schema: z.Schema<unknown>): FormValidator {
  return (value: unknown) => {
    const result = schema.safeParse(value);
    if (result.success) {
      return null;
    }

    if (result.error.issues.length > 0) {
      return result.error.issues[0].message;
    }

    return null;
  };
}
