import { hc } from "hono/client";
import type { ApiType } from "backend/app";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const client = hc<ApiType>(`${API_BASE}/api`);
