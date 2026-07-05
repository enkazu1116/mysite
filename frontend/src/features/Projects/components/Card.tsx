import { Card, Link } from "@heroui/react";
import type { Project } from "../types/project";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <Card className="w-full max-w-[400px] text-left">
      <Card.Header className="text-left">
        <Card.Title className="text-left">{project.projectName}</Card.Title>
        <Card.Description className="text-left">
          {project.description}
          <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
            {project.useLanguage} / {project.useFramework} / {project.useDatabase}
          </span>
          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
            役割: {project.myRole}
          </span>
        </Card.Description>
      </Card.Header>

      <Card.Footer className="justify-start text-left">
        <Link
          className="justify-start"
          aria-label={`${project.projectName} の詳細（未実装）`}
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          プロジェクト詳細（未実装）
          <Link.Icon aria-hidden="true" />
        </Link>
      </Card.Footer>
    </Card>
  );
}