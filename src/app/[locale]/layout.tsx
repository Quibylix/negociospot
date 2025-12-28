import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/features/i18n/routing";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { Logger } from "@/features/logger/logger";
import { AppShell } from "@/features/ui/app-shell/app-shell.component";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout").catch(() => {
    Logger.error("Error fetching layout translations");
    return null;
  });

  if (!t) {
    return {
      title: "NegocioSpot",
      description: "Encuentra los mejores negocios cerca de ti",
    };
  }

  return {
    title: t("title"),
    description: t("description"),
  };
}

const theme = createTheme({
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <NextIntlClientProvider>
            <AppShell>{children}</AppShell>
          </NextIntlClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
