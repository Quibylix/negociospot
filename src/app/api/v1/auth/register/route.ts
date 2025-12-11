import { z } from "zod";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import { ERRORS } from "@/features/shared/constants/errors";

export const registerBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  let parsedBody: z.infer<typeof registerBodySchema>;
  try {
    const body = await req.json();
    parsedBody = registerBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid registration request body", e);
    return Response.json(
      {
        error: ERRORS.AUTH.INVALID_CREDENTIALS,
      },
      { status: 400 },
    );
  }

  const { email, password } = parsedBody;
  try {
    await AuthService.register({ email, password });
  } catch (e) {
    Logger.warn("Failed registration attempt", { email }, e);
    return Response.json(
      {
        error: ERRORS.AUTH.USER_ALREADY_EXISTS,
      },
      { status: 409 },
    );
  }

  Logger.log("User registered successfully", { email });
  return new Response(null, { status: 200 });
}
