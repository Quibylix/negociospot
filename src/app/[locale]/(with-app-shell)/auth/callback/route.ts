import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import { ERRORS } from "@/features/shared/constants/errors";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    Logger.warn("No code provided in authentication callback");
    return NextResponse.redirect(
      `${origin}/auth/login?error=${ERRORS.AUTH.NO_CODE_PROVIDED}`,
    );
  }

  try {
    await AuthService.exchangeCodeForSession(code);
  } catch (error) {
    Logger.warn("Authentication failed", { error });
    return NextResponse.redirect(
      `${origin}/auth/login?error=${ERRORS.AUTH.SERVER_ERROR}`,
    );
  }

  return NextResponse.redirect(`${origin}/`);
}
