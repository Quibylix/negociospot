import { createBrowserClient } from "@supabase/ssr";
import { Logger } from "@/features/logger/logger";

export function createClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    Logger.error("Supabase environment variables are not set properly.");
    throw new Error("Supabase environment variables are not set properly.");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
