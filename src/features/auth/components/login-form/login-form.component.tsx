"use client";

import { Button, Paper, PasswordInput, TextInput } from "@mantine/core";
import { useLoginForm } from "./use-login-form.hook";

export function LoginForm() {
  const { form, t, submitHandler } = useLoginForm();

  return (
    <Paper
      withBorder
      shadow="sm"
      p="md"
      radius="md"
      component="form"
      onSubmit={form.onSubmit(submitHandler)}
    >
      <TextInput
        label={t("email_label")}
        placeholder={t("email_placeholder")}
        key={form.key("email")}
        {...form.getInputProps("email")}
        withAsterisk
        mb="md"
        radius="md"
      />
      <PasswordInput
        label={t("password_label")}
        placeholder={t("password_placeholder")}
        key={form.key("password")}
        {...form.getInputProps("password")}
        withAsterisk
        mb="md"
        radius="md"
      />
      <Button type="submit" fullWidth mt="xl" radius="md">
        {t("submit_button")}
      </Button>
    </Paper>
  );
}
