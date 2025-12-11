"use client";

import {
  Button,
  Divider,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRegisterForm } from "./use-register-form.hook";

export function RegisterForm() {
  const { form, t, submitHandler, registerWithGoogle } = useRegisterForm();

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
      <PasswordInput
        label={t("confirm_password_label")}
        placeholder={t("confirm_password_placeholder")}
        key={form.key("confirmPassword")}
        {...form.getInputProps("confirmPassword")}
        withAsterisk
        mb="md"
        radius="md"
      />
      <Button type="submit" fullWidth mt="xl" radius="md">
        {t("submit_button")}
      </Button>
      <Divider my="lg" label={t("divider")} labelPosition="center" />
      <Button
        type="button"
        onClick={registerWithGoogle}
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
