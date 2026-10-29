import type { InferResponseType } from "hono/client";
import { usersRpc } from "../api/rpc";

export type User = InferResponseType<typeof usersRpc.$get, 200>["users"][number];
