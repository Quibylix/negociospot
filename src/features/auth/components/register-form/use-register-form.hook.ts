import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import type { z } from "zod";
import {
  type registerBodySchema,
  registerResponseSchema,
} from "@/features/auth/schemas/register.schema";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import { getValidators } from "./validators";

export function useRegisterForm() {
  const errorsT = useTranslations("errors");
  const t = useTranslations("register.form");
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: getValidators(errorsT),
  });
  const router = useRouter();

  function submitHandler(values: typeof form.values) {
    fetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      } satisfies z.infer<typeof registerBodySchema>),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => registerResponseSchema.parse(data))
      .then((res) => {
        if (res?.error) {
          return notifyError(errorsT(res.error), errorsT(res.error));
        }
        notifySuccess(t("success_message"), t("success_message"));
        return router.replace("/auth/confirm-email");
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
