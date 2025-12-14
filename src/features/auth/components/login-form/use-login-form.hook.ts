import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import type { z } from "zod";
import {
  type loginBodySchema,
  loginResponseSchema,
} from "@/features/auth/schemas/login.schema";
import { useRouter } from "@/features/i18n/navigation";
import { notifyError, notifySuccess } from "@/features/notifications/notify";
import { createClient } from "@/lib/supabase/client";
import { getValidators } from "./validators";

export function useLoginForm() {
  const errorsT = useTranslations("errors");
  const t = useTranslations("login.form");
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: getValidators(errorsT),
  });
  const router = useRouter();

  function submitHandler(values: typeof form.values) {
    fetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        provider: "email",
        ...values,
      } satisfies z.infer<typeof loginBodySchema>),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => loginResponseSchema.parse(data))
      .then((res) => {
        if (res?.error) {
          return notifyError(errorsT(res.error), errorsT(res.error));
        }
        notifySuccess(t("success_message"), t("success_message"));
        router.replace("/");
        router.refresh();
      })
      .catch(() => {
        notifyError(
          errorsT("generic.unknown_error"),
          errorsT("generic.unknown_error"),
        );
      });
  }

  function loginWithGoogle() {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return { form, t, submitHandler, loginWithGoogle };
}
