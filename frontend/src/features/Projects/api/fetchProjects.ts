import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "../types/project";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const configuredProjectsUserId = import.meta.env.VITE_BOOKS_USER_ID?.trim();

export async function resolveProjectsUserId(): Promise<string> {
  if (configuredProjectsUserId) {
    return configuredProjectsUserId;
  }

  const { users } = await requestJson<{ users: { id: string }[] }>(
    "/users",
    "Failed to fetch users",
  );
  const userId = users[0]?.id;
  if (!userId) {
    throw new Error("登録先のユーザーが見つかりませんでした。");
  }
  return userId;
}

async function requestJson<T>(
  path: string,
  fallback: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw await parseApiError(response, fallback);
  }

  return response.json() as Promise<T>;
}

async function parseApiError(response: Response, fallback: string) {
  const errorBody = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;
  return new Error(
    errorBody?.message ?? `${fallback}: ${String(response.status)}`,
  );
}

export const listProjects = async (userId?: string): Promise<Project[]> => {
  const params = new URLSearchParams();
  if (userId) {
    params.set("userId", userId);
  }
  const query = params.toString();
  const { projects } = await requestJson<{ projects: Project[] }>(
    `/projects${query ? `?${query}` : ""}`,
    "Failed to fetch projects",
  );
  return projects;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const { project } = await requestJson<{ project: Project }>(
    `/projects/${encodeURIComponent(projectId)}`,
    "Failed to fetch project",
  );
  return project;
};

export const createProject = async (
  payload: CreateProjectPayload,
): Promise<Project> => {
  const { project } = await requestJson<{ project: Project }>(
    "/projects",
    "Failed to create project",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return project;
};

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload,
): Promise<Project> => {
  const { project } = await requestJson<{ project: Project }>(
    `/projects/${encodeURIComponent(projectId)}`,
    "Failed to update project",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return project;
};

export const deleteProject = async (projectId: string): Promise<Project> => {
  const { project } = await requestJson<{ project: Project }>(
    `/projects/${encodeURIComponent(projectId)}`,
    "Failed to delete project",
    {
      method: "DELETE",
    },
  );
  return project;
};

/** @deprecated use listProjects */
export const fetchProjects = listProjects;
