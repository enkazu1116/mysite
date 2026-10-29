import type { InferRequestType, InferResponseType } from "hono/client";
import { projectsRpc } from "../api/rpc";

type Project = InferResponseType<typeof projectsRpc.$get, 200>["projects"][number];
type CreateProjectPayload = InferRequestType<typeof projectsRpc.$post>["json"];
type UpdateProjectPayload = InferRequestType<
  typeof projectsRpc[":projectId"]["$patch"]
>["json"];

export type { CreateProjectPayload, Project, UpdateProjectPayload };
