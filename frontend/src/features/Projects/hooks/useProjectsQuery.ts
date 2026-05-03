import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/fetchProjects";

export const useProjectsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return { projects: data, isLoading, error, refetch };
};
