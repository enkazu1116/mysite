import type { ApiType } from "backend/app";
import { hc } from "hono/client";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const client = hc<ApiType>(`${API_BASE}/api`);
