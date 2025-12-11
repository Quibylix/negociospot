import type { z } from "zod";
import {
  loginBodySchema,
  type loginResponseSchema,
} from "@/features/auth/schemas/login.schema";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/routes/create-typed-json-route.helper";
import { ERRORS } from "@/features/shared/constants/errors";

const _POST = async (req: Request) => {
  let parsedBody: z.infer<typeof loginBodySchema>;
  try {
    const body = await req.json();
    parsedBody = loginBodySchema.parse(body);
  } catch {
    Logger.warn("Invalid login request body");
    return typedJsonResponse({ error: ERRORS.AUTH.INVALID_CREDENTIALS }, 400);
  }

  const { provider } = parsedBody;
  if (provider === "google") {
    Logger.warn("Google login is not implemented yet");
    return typedJsonResponse({ error: ERRORS.AUTH.SERVER_ERROR }, 500);
  }

  const { email, password } = parsedBody;
  try {
    await AuthService.login({ email, password });
  } catch {
    Logger.warn("Failed login attempt", { email });
    return typedJsonResponse({ error: ERRORS.AUTH.USER_NOT_FOUND }, 401);
  }

  Logger.log("User logged in successfully", { email });
  return typedJsonResponse(null, 200);
};

export const POST =
  createTypedJsonRoute<z.infer<typeof loginResponseSchema>>(_POST);
