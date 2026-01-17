"use client";

import {
  Anchor,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  Container,
  Group,
  AppShell as MantineAppShell,
  NavLink,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/features/i18n/navigation";
import { Footer, type FooterProps } from "../footer/footer.component";
import { Logo } from "../logo.component";

const MENU_WIDTH = 300;

export type AppShellViewProps = {
  children: React.ReactNode;
  navbarLinks: { label: string; href: string }[];
  footerLinks: FooterProps["links"];
};

export function AppShellView({
  children,
  navbarLinks,
  footerLinks,
}: AppShellViewProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const t = useTranslations("app_shell");

  return (
    <MantineAppShell
      header={{ height: 65 }}
      navbar={{
        width: MENU_WIDTH,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger
            aria-label={t("toggle_menu")}
            opened={opened}
            onClick={toggle}
            hiddenFrom="md"
            size="sm"
          />
          <Anchor component={Link} href="/" fw={700} display="flex">
            <Logo h={30} />
          </Anchor>
        </Group>
      </AppShellHeader>
      <AppShellNavbar p="md">
        {navbarLinks.map((link) => (
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
      <AppShellMain display="flex">
        <Stack w="100%">
          <Container flex="1 0 auto" w="100%" fluid p="md">
            {children}
          </Container>
          <Footer links={footerLinks} />
        </Stack>
      </AppShellMain>
    </MantineAppShell>
  );
}
