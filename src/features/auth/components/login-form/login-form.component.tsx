"use client";

import {
  Button,
  Divider,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useLoginForm } from "./use-login-form.hook";

export function LoginForm() {
  const { form, t, submitHandler, loginWithGoogle } = useLoginForm();

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
      <Divider my="lg" label={t("divider")} labelPosition="center" />
      <Button
        onClick={loginWithGoogle}
        type="button"
        fullWidth
        mb="md"
        radius="md"
        variant="outline"
        leftSection={<IconBrandGoogle size={18} />}
      >
        {t("google_button")}
      </Button>
    </Paper>
  );
}
