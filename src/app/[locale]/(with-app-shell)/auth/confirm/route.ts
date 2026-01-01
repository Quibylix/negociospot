import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { createClient } from "@/lib/supabase/server";

const emailOtpTypesSchema = z.enum([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] satisfies EmailOtpType[]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const typeParsedResult = emailOtpTypesSchema.safeParse(
    searchParams.get("type"),
  );

  const next = "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && typeParsedResult.success) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: typeParsedResult.data,
      token_hash,
    });

    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
