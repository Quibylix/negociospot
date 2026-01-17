import { getTranslations } from "next-intl/server";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { generateFooterLinks } from "../footer/generate-footer-links.util";
import { AppShellView } from "./app-shell-view.component";
import { generateNavbarLinks } from "./generate-navbar-links.util";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [navT, footerT] = await Promise.all([
    getTranslations("app_shell.navbar"),
    getTranslations("footer"),
  ]);

  const user = await AuthService.getCurrentUser();
  const baseNavbarLinks = generateNavbarLinks(navT);
  const footerLinks = generateFooterLinks(footerT);

  const navbarLinks: { label: string; href: string }[] = [baseNavbarLinks.HOME];
  if (check(user).can("create", "Session").verify()) {
    navbarLinks.push(baseNavbarLinks.LOGIN);
    navbarLinks.push(baseNavbarLinks.REGISTER);
  } else {
    navbarLinks.push(baseNavbarLinks.FAVORITES);
  }

  if (check(user).can("create", "Restaurant").verify()) {
    navbarLinks.push(baseNavbarLinks.CREATE_RESTAURANT);
  }

  navbarLinks.push(baseNavbarLinks.BLOG);

  return (
    <AppShellView navbarLinks={navbarLinks} footerLinks={footerLinks}>
      {children}
    </AppShellView>
  );
}
