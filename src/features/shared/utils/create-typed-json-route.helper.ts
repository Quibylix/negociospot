import type { NextRequest } from "next/server";

type ValidResponse = Record<string, unknown> | null;

export function typedJsonResponse<T extends ValidResponse>(
  data: T,
  statusCode?: number,
) {
  return { data, statusCode };
}

export function createTypedJsonRoute<T extends ValidResponse>(
  cb: (req: NextRequest) => Promise<ReturnType<typeof typedJsonResponse<T>>>,
) {
  return async (req: NextRequest) => {
    const result = await cb(req);
    return Response.json(result.data, {
      status: result.statusCode ?? 200,
    });
  };
}
