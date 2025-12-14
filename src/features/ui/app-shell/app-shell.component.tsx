import { AuthService } from "@/features/auth/service";
import { getUserAbility } from "@/features/auth/utils/permissions.util";
import { AppShellView } from "./app-shell-view.component";
import { NAVBAR_LINKS } from "./navbar-links.constant";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await AuthService.getCurrentUser();
  const ability = getUserAbility(user ? { id: user.id } : null);

  const navbarLinks: { label: string; href: string }[] = [NAVBAR_LINKS.HOME];
  if (ability.can("create", "Session")) {
    navbarLinks.push(NAVBAR_LINKS.LOGIN);
    navbarLinks.push(NAVBAR_LINKS.REGISTER);
  }

  return <AppShellView navbarLinks={navbarLinks}>{children}</AppShellView>;
}
