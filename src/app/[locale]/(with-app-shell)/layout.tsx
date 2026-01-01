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
  type MantineColorsTuple,
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

const orangePalette: MantineColorsTuple = [
  "#fff0e6",
  "#ffdec9",
  "#ffc29f",
  "#ffa373",
  "#ff8748",
  "#ff6b00",
  "#e65d00",
  "#cc5000",
  "#a63f00",
  "#803000",
];

const neutralPalette: MantineColorsTuple = [
  "#F8F9FA",
  "#E9ECEF",
  "#DEE2E6",
  "#CED4DA",
  "#ADB5BD",
  "#868E96",
  "#495057",
  "#2C2E33",
  "#25262b",
  "#1A1B1E",
];

const theme = createTheme({
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  colors: {
    primary: orangePalette,
    dark: neutralPalette,
  },
  primaryColor: "primary",
  primaryShade: { light: 5, dark: 4 },
  white: "#FFFFFF",
  black: neutralPalette[7],
  defaultRadius: "md",
  headings: {
    fontWeight: "700",
    fontFamily: "Montserrat, Poppins, Inter, system-ui, sans-serif",
  },
  components: {
    Button: {
      defaultProps: {
        fw: 600,
      },
    },
    Title: {
      defaultProps: {
        c: "dark.7",
      },
    },
  },
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
