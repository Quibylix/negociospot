import { createClient } from "@/lib/supabase/server";
import { Logger } from "../logger/logger";

export const AuthService = {
  async getCurrentUser(): Promise<{ id: string; email: string | null } | null> {
    const supabase = await createClient();
    const {
      data: { user: sbUser },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      Logger.warn("Error fetching current user:", error.message);
      return null;
    }
    if (!sbUser) return null;
    return { id: sbUser.id, email: sbUser.email ?? null };
  },

  async login({ email, password }: { email: string; password: string }) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async register({ email, password }: { email: string; password: string }) {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      Logger.error("NEXT_PUBLIC_SITE_URL is not defined");
      throw new Error("Internal server error");
    }

    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/confirm` },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async exchangeCodeForSession(code: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(error.message);
    }
  },

  async logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
  },
};
