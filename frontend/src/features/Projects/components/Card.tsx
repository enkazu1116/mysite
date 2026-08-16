import { Link } from "@heroui/react/link";
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
        {project.description}
      </p>
      <p className="mt-3 m-0 text-xs text-[var(--lib-ink-muted)]">
        {project.useLanguage} / {project.useFramework} / {project.useDatabase}
      </p>
      <p className="mt-1 m-0 text-xs text-[var(--lib-ink-muted)]">
        役割: {project.myRole}
      </p>
      <div className="mt-4">
        <Link
          className="lib-link text-sm"
          aria-label={`${project.projectName} の詳細（未実装）`}
          href="#"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          プロジェクト詳細（未実装）
          <Link.Icon aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
