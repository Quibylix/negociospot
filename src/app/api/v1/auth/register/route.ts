import type { z } from "zod";
import {
  registerBodySchema,
  type registerResponseSchema,
} from "@/features/auth/schemas/register.schema";
import { AuthService } from "@/features/auth/service";
import { Logger } from "@/features/logger/logger";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/routes/create-typed-json-route.helper";
import { ERRORS } from "@/features/shared/constants/errors";

const _POST = async (req: Request) => {
  let parsedBody: z.infer<typeof registerBodySchema>;
  try {
    const body = await req.json();
    parsedBody = registerBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid registration request body", e);
    return typedJsonResponse({ error: ERRORS.AUTH.INVALID_CREDENTIALS }, 400);
  }

  const { email, password } = parsedBody;
  try {
    await AuthService.register({ email, password });
  } catch (e) {
    Logger.warn("Failed registration attempt", { email }, e);
    return typedJsonResponse({ error: ERRORS.AUTH.USER_ALREADY_EXISTS }, 409);
  }

  Logger.log("User registered successfully", { email });
  return typedJsonResponse(null, 200);
};

export const POST =
  createTypedJsonRoute<z.infer<typeof registerResponseSchema>>(_POST);
