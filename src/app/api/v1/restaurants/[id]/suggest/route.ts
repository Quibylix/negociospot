import type z from "zod";
import { AuthService } from "@/features/auth/service";
import { check } from "@/features/auth/utils/permissions.util";
import { Logger } from "@/features/logger/logger";
import {
  updateRestaurantBodySchema,
  type updateRestaurantResponseSchema,
} from "@/features/restaurants/schemas/update-restaurant.schema";
import {
  getRestaurantAccessInfo,
  registerRestaurantChangeSuggestion,
} from "@/features/restaurants/service";
import { ERRORS } from "@/features/shared/constants/errors";
import {
  createTypedJsonRoute,
  typedJsonResponse,
} from "@/features/shared/utils/create-typed-json-route.helper";

export const POST = createTypedJsonRoute<
  z.infer<typeof updateRestaurantResponseSchema>,
  { params: Promise<{ id: string }> }
>(async (req, { params }) => {
  const { id } = await params;

  const user = await AuthService.getCurrentUser();

  if (!Number(id)) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.INVALID_RESTAURANT_ID },
      400,
    );
  }

  const accessInfoResult = await getRestaurantAccessInfo({
    uid: { id: Number(id) },
  });

  if (accessInfoResult.isErr()) {
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  if (accessInfoResult.value === null) {
    return typedJsonResponse({ error: ERRORS.RESTAURANTS.NOT_FOUND }, 404);
  }

  const accessInfo = {
    creatorId: accessInfoResult.value.createdById,
    admins: accessInfoResult.value.administrators.map(
      (admin) => admin.profileId,
    ),
  };

  if (
    !check(user).can("suggestChanges", "Restaurant").verify(accessInfo) ||
    !user
  ) {
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.UNAUTHORIZED_SUGGESTION },
      403,
    );
  }

  const body = await req.json();
  let parsedBody: z.infer<typeof updateRestaurantBodySchema>;
  try {
    parsedBody = updateRestaurantBodySchema.parse(body);
  } catch (e) {
    Logger.warn("Invalid restaurant change suggestion data", { error: e });
    return typedJsonResponse(
      { error: ERRORS.RESTAURANTS.INVALID_SUGGESTION_DATA },
      400,
    );
  }

  const result = await registerRestaurantChangeSuggestion({
    creatorId: user.id,
    uid: { id: Number(id) },
    data: parsedBody,
  });

  if (result.isErr()) {
    return typedJsonResponse({ error: ERRORS.GENERIC.UNKNOWN_ERROR }, 500);
  }

  return typedJsonResponse({
    id: result.value.restaurant.id,
    slug: result.value.restaurant.slug,
  });
});
