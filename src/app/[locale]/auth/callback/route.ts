import { NextResponse } from "next/server";
import { ErrorCodes } from "@/features/auth/error-codes";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    Logger.warn("No code provided in authentication callback");
    return NextResponse.redirect(
      `${origin}/login?error=${ErrorCodes.NO_CODE_PROVIDED}`,
    );
  }

  try {
    await AuthService.exchangeCodeForSession(code);
  } catch (error) {
    Logger.warn("Authentication failed", { error });
    return NextResponse.redirect(
      `${origin}/login?error=${ErrorCodes.AUTHENTICATION_FAILED}`,
    );
  }

  return NextResponse.redirect(`${origin}/`);
}
