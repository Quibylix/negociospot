"use client";

import {
  Anchor,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  Group,
  AppShell as MantineAppShell,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/features/i18n/navigation";
import { NAVBAR_LINKS } from "./navbar-links.constant";

const MENU_WIDTH = 300;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const t = useTranslations("app_shell");

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: MENU_WIDTH,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
          <Anchor component={Link} variant="gradient" href="/" fw={700}>
            {t("app_name")}
          </Anchor>
        </Group>
      </AppShellHeader>
      <AppShellNavbar p="md">
        {NAVBAR_LINKS.map((link) => (
          <NavLink
            component={Link}
            onClick={() => opened && toggle()}
            key={link.href}
            active={pathname === link.href}
            href={link.href}
            label={link.label}
          />
        ))}
      </AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
    </MantineAppShell>
  );
}
