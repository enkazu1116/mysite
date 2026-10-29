import type { InferResponseType } from "hono/client";
import { skillsRpc } from "../api/rpc";

export type Skill = InferResponseType<typeof skillsRpc.$get, 200>[number];
