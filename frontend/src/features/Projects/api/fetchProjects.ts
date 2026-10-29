import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "../types/project";
import { projectsRpc } from "./rpc";
import { readRpcResponse } from "../../../lib/api-client";
import { usersRpc } from "../../Users/api/rpc";
import type { User } from "../../Users/types/user";

const configuredProjectsUserId = import.meta.env.VITE_BOOKS_USER_ID?.trim();

export async function resolveProjectsUserId(): Promise<string> {
  if (configuredProjectsUserId) {
    return configuredProjectsUserId;
  }

  const usersResponse = await usersRpc.$get({});
  const { users } = await readRpcResponse<{ users: User[] }>(
    usersResponse,
    "Failed to fetch users",
  );
  const userId = users[0]?.id;
  if (!userId) {
    throw new Error("登録先のユーザーが見つかりませんでした。");
  }
  return userId;
}

export const listProjects = async (userId?: string): Promise<Project[]> => {
  const response = await projectsRpc.$get({ query: userId ? { userId } : {} });
  const { projects } = await readRpcResponse<{ projects: Project[] }>(
    response,
    "Failed to fetch projects",
  );
  return projects;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await projectsRpc[":projectId"].$get({ param: { projectId } });
  const { project } = await readRpcResponse<{ project: Project }>(response, "Failed to fetch project");
  return project;
};

export const createProject = async (
  payload: CreateProjectPayload,
): Promise<Project> => {
  const response = await projectsRpc.$post({ json: payload });
  const { project } = await readRpcResponse<{ project: Project }>(response, "Failed to create project");
  return project;
};

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload,
): Promise<Project> => {
  const response = await projectsRpc[":projectId"].$patch({
    param: { projectId },
    json: payload,
  });
  const { project } = await readRpcResponse<{ project: Project }>(response, "Failed to update project");
  return project;
};

export const deleteProject = async (projectId: string): Promise<Project> => {
  const response = await projectsRpc[":projectId"].$delete({ param: { projectId } });
  const { project } = await readRpcResponse<{ project: Project }>(response, "Failed to delete project");
  return project;
};

/** @deprecated use listProjects */
export const fetchProjects = listProjects;
