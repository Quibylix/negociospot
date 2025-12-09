import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./features/i18n/routing";
import { updateSession } from "./lib/supabase/proxy";

const i18nMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = i18nMiddleware(request);
  return await updateSession(request, response);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
