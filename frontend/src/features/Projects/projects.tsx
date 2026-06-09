import { EmptyState, Typography } from "@heroui/react";
import { ProjectCard } from "./components/Card";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { ErrorState, LoadingState } from "../../components/status";

export default function Projects() {
  const query = useProjectsQuery();

  if (query.isLoading) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <LoadingState />
      </main>
    );
  }

  if (query.error) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <ErrorState
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      </main>
    );
  }

  const projects = query.projects ?? [];
  if (projects.length === 0) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <EmptyState className="py-12">
          <p>プロジェクトがありません。</p>
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 pb-4 pt-0.5">
      <Typography.Heading level={2} className="mb-4 text-left">
        Projects
      </Typography.Heading>
      <div className="flex flex-wrap justify-center gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
