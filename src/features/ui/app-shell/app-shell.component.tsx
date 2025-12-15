import { getTranslations } from "next-intl/server";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { AppShellView } from "./app-shell-view.component";
import { generateNavbarLinks } from "./generate-navbar-links.util";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const navT = await getTranslations("app_shell.navbar");

  const user = await AuthService.getCurrentUser();
  const baseNavbarLinks = generateNavbarLinks(navT);

  const navbarLinks: { label: string; href: string }[] = [baseNavbarLinks.HOME];
  if (check(user).can("create", "Session").verify()) {
    navbarLinks.push(baseNavbarLinks.LOGIN);
    navbarLinks.push(baseNavbarLinks.REGISTER);
  }

  return <AppShellView navbarLinks={navbarLinks}>{children}</AppShellView>;
}
