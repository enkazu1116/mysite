import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  resolveProjectsUserId,
  updateProject,
} from "../api/fetchProjects";
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../types/project";

export const projectKeys = {
  all: ["projects"] as const,
  list: (userId?: string) => ["projects", "list", userId ?? "all"] as const,
  detail: (projectId: string) => ["projects", "detail", projectId] as const,
  userId: ["projects-user-id"] as const,
};

export function useProjectsUserIdQuery() {
  return useQuery({
    queryKey: projectKeys.userId,
    queryFn: resolveProjectsUserId,
  });
}

export function useProjectsQuery(userId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: projectKeys.list(userId),
    queryFn: () => listProjects(userId),
  });

  return { projects: data, isLoading, error, refetch };
}

export function useProjectQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ""),
    queryFn: () => getProject(projectId ?? ""),
    enabled: Boolean(projectId),
  });
}

export function useCreateProjectMutation(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<CreateProjectPayload, "userId"> & { userId?: string },
    ) => {
      const resolvedUserId = payload.userId ?? userId ?? (await resolveProjectsUserId());
      return createProject({ ...payload, userId: resolvedUserId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectPayload;
    }) => updateProject(projectId, payload),
    onSuccess: (project) => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
      void queryClient.invalidateQueries({
        queryKey: projectKeys.detail(project.projectId),
      });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
