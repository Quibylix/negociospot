import { Result } from "neverthrow";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./features/i18n/routing";
import { Logger } from "./features/logger/logger";
import { updateSession } from "./lib/supabase/proxy";

const i18nMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  const siteUrlResult = Result.fromThrowable(
    () => new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  )();

  if (siteUrlResult.isErr()) {
    Logger.error("Failed to construct site URL", {
      error: siteUrlResult.error,
    });
    return NextResponse.next();
  }

  const rootDomain = siteUrlResult.value.host;
  const isRootDomain =
    hostname.replace("www.", "") === rootDomain.replace("www.", "");

  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse.status >= 300 || isRootDomain) {
    return await updateSession(request, i18nResponse);
  }

  const slug = hostname.replace(`.${rootDomain}`, "");
  const internalPathWithLocale =
    i18nResponse.headers.get("x-middleware-rewrite") || url.pathname;

  if (!/^\/[^/]+\/?$/.test(internalPathWithLocale)) {
    const destinationUrlResult = Result.fromThrowable(
      () =>
        new URL(`${url.protocol}//${rootDomain}${url.pathname}${url.search}`),
    )();

    if (destinationUrlResult.isErr()) {
      Logger.error("Failed to construct destination URL", {
        error: destinationUrlResult.error,
      });
      return NextResponse.next();
    }

    const redirectResponse = NextResponse.redirect(destinationUrlResult.value);
    return await updateSession(request, redirectResponse);
  }

  const tenantInternalPath = internalPathWithLocale.replace(
    /^\/([^/]+)(\/.*)?$/,
    `/$1/restaurants/${slug}/website$2`,
  );
  const destinationURLResult = Result.fromThrowable(
    () => new URL(tenantInternalPath, url),
  )();

  if (destinationURLResult.isErr()) {
    Logger.error("Failed to construct destination URL", {
      error: destinationURLResult.error,
    });
    return NextResponse.next();
  }

  const rewriteResponse = NextResponse.rewrite(destinationURLResult.value, {
    headers: i18nResponse.headers,
  });
  return await updateSession(request, rewriteResponse);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
