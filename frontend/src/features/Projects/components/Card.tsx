import { Link as RouterLink } from "react-router";
import type { Project } from "../types/project";

type Props = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: Props) {
  return (
    <article
      className={`lib-panel flex h-full flex-col p-5 text-left ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="font-display m-0 text-lg font-semibold text-[var(--lib-ink)]">
        {project.projectName}
      </h2>
      <p className="mt-2 m-0 text-sm leading-relaxed text-[var(--lib-ink-muted)]">
        {project.overview}
      </p>
      <p className="mt-3 m-0 text-xs text-[var(--lib-ink-muted)]">
        {project.technologies}
      </p>
      <p className="mt-1 m-0 text-xs text-[var(--lib-ink-muted)]">
        役割: {project.myRole} · チーム: {project.teamSize}名
      </p>
      <p className="mt-2 m-0 line-clamp-2 text-sm text-[var(--lib-ink)]">
        成果: {project.outcomes}
      </p>
      <div className="mt-4">
        <RouterLink
          className="lib-link text-sm"
          to={`/projects/${project.projectId}`}
          aria-label={`${project.projectName} の詳細`}
        >
          プロジェクト詳細
        </RouterLink>
      </div>
    </article>
  );
}
