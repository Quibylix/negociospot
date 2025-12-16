import type { NextRequest } from "next/server";

type ValidResponse = Record<string, unknown> | null;

export function typedJsonResponse<T extends ValidResponse>(
  data: T,
  statusCode?: number,
) {
  return { data, statusCode };
}

export function createTypedJsonRoute<T extends ValidResponse, U = undefined>(
  cb: (
    req: NextRequest,
    params: U,
  ) => Promise<ReturnType<typeof typedJsonResponse<T>>>,
) {
  return async (req: NextRequest, params: U) => {
    const result = await cb(req, params);
    return Response.json(result.data, {
      status: result.statusCode ?? 200,
    });
  };
}
