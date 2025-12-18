import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/features/i18n/routing";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { Logger } from "@/features/logger/logger";
import { AppShell } from "@/features/ui/app-shell/app-shell.component";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider>
          <Notifications />
          <NextIntlClientProvider>
            <AppShell>{children}</AppShell>
          </NextIntlClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
