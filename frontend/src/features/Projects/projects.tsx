import { ProjectCard } from "./components/Card";
import { useProjectsQuery } from "./hooks/useProjectsQuery";

export default function Projects() {
  const query = useProjectsQuery();

  if (query.isLoading) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <p>Loading...</p>
      </main>
    );
  }

  if (query.error) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <div>
          <p>Error: {query.error.message}</p>
          <button type="button" onClick={() => void query.refetch()}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  const projects = query.projects ?? [];
  if (projects.length === 0) {
    return (
      <main className="flex-1 px-4 pb-4 pt-0.5">
        <p>プロジェクトがありません。</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 pb-4 pt-0.5">
      <div className="flex flex-wrap gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
