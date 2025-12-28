import type { NextRequest } from "next/server";

type ValidResponse = Record<string, unknown> | null;

export function typedJsonResponse<T extends ValidResponse>(
  data: T,
  statusCode?: number,
) {
  return { data, statusCode };
}

export function createTypedJsonRoute<
  T extends ValidResponse,
  U = { params: Promise<Record<string, never>> },
>(
  cb: (
    req: NextRequest,
    context: U,
  ) => Promise<ReturnType<typeof typedJsonResponse<T>>>,
) {
  return async (req: NextRequest, context: U) => {
    const result = await cb(req, context);
    return Response.json(result.data, {
      status: result.statusCode ?? 200,
    });
  };
}
