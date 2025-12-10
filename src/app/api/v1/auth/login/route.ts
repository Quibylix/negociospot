import { z } from "zod";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import { ERRORS } from "@/features/shared/constants/errors";

export const loginBodySchema = z
  .object({
    provider: z.literal("email"),
    email: z.email(),
    password: z.string().min(6).max(100),
  })
  .or(
    z.object({
      provider: z.literal("google"),
    }),
  );

export async function POST(req: Request) {
  let parsedBody: z.infer<typeof loginBodySchema>;
  try {
    const body = await req.json();
    parsedBody = loginBodySchema.parse(body);
  } catch {
    Logger.warn("Invalid login request body");
    return Response.json(
      {
        error: ERRORS.AUTH.INVALID_CREDENTIALS,
      },
      { status: 400 },
    );
  }

  const { provider } = parsedBody;
  if (provider === "google") {
    Logger.warn("Google login is not implemented yet");
    return Response.json({ message: ERRORS.AUTH.SERVER_ERROR });
  }

  const { email, password } = parsedBody;
  try {
    await AuthService.login({ email, password });
  } catch {
    Logger.warn("Failed login attempt", { email });
    return Response.json(
      {
        error: ERRORS.AUTH.USER_NOT_FOUND,
      },
      { status: 401 },
    );
  }

  Logger.log("User logged in successfully", { email });
  return new Response(null, { status: 200 });
}
