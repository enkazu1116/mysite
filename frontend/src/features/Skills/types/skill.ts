import type { InferResponseType } from "hono/client";

import type { client } from "../../../lib/api-client";

type SkillsResponse = InferResponseType<typeof client.skills.$get>;

export type Skill = SkillsResponse[number];
