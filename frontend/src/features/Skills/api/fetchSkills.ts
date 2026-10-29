import type { Skill } from "../types/skill";
import { readRpcResponse } from "../../../lib/api-client";
import { skillsRpc } from "./rpc";

export const fetchSkills = async () => {
  return readRpcResponse<Skill[]>(
    await skillsRpc.$get({}),
    "Failed to fetch skills",
  );
};
