import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
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

  function submitHandler(values: typeof form.values) {
    console.log("Form submitted with values:", values);
  }

  return { form, t, submitHandler };
}
