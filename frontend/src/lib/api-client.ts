import { hc } from "hono/client";
import type { ApiType } from "backend/rpc";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
export const rpcClient = hc<ApiType>(`${API_BASE}/api`);

export async function readRpcResponse<T>(
  response: Response,
  fallback: string,
): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(
      errorBody?.message ?? `${fallback}: ${String(response.status)}`,
    );
  }

  return response.json() as Promise<T>;
}
