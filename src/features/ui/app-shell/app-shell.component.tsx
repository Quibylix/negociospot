import { AppShellView } from "./app-shell-view.component";
import { NAVBAR_LINKS } from "./navbar-links.constant";

export async function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellView navbarLinks={NAVBAR_LINKS}>{children}</AppShellView>;
}
