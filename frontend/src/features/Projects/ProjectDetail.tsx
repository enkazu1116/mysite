import { EmptyState } from "@heroui/react/empty-state";
import { Spinner } from "@heroui/react/spinner";
import { motion, useReducedMotion } from "motion/react";
import { Link as RouterLink, useParams } from "react-router";
import { ArrowLeftIcon } from "../../components/icons";
import { LibrarySurface } from "../../components/LibrarySurface.tsx";
import { QueryErrorAlert } from "../../components/status";
import { useProjectQuery } from "./hooks/useProjectsQuery";

const sections = [
  { key: "overview", label: "概要" },
  { key: "myRole", label: "自分の役割" },
  { key: "technologies", label: "使用技術" },
  { key: "challenges", label: "課題" },
  { key: "decisions", label: "工夫 / 意思決定" },
  { key: "outcomes", label: "成果" },
] as const;

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProjectQuery(projectId);
  const reduceMotion = useReducedMotion();

  return (
    <LibrarySurface className="px-4 pb-10 pt-4 sm:px-6">
      <section className="mx-auto mb-6 max-w-3xl text-left">
        <RouterLink
          to="/projects"
          aria-label="Projectsへ戻る"
          title="Projectsへ戻る"
          className="lib-back"
        >
          <ArrowLeftIcon />
        </RouterLink>
      </section>

      <QueryErrorAlert
        error={project.error}
        fallback="プロジェクト詳細の取得に失敗しました。"
        className="mx-auto mb-4 max-w-3xl text-left"
      />

      {project.isLoading && (
        <div className="mx-auto flex max-w-3xl items-center gap-2 py-10 text-[var(--lib-ink-muted)]">
          <Spinner size="sm" />
          <span className="text-sm">プロジェクトを取得中...</span>
        </div>
      )}

      {!project.isLoading && !project.data && (
        <EmptyState className="mx-auto max-w-3xl py-10">
          <p className="text-[var(--lib-ink-muted)]">
            プロジェクトが見つかりません。
          </p>
        </EmptyState>
      )}

      {project.data && (
        <motion.article
          className="mx-auto max-w-3xl text-left"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="font-display m-0 text-3xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-4xl">
            {project.data.projectName}
          </h1>
          <p className="mt-2 text-sm text-[var(--lib-ink-muted)]">
            チーム規模: {project.data.teamSize}名
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.key} className="lib-panel p-5">
                <h2 className="font-display m-0 text-lg font-semibold text-[var(--lib-ink)]">
                  {section.label}
                </h2>
                <p className="mt-2 mb-0 whitespace-pre-wrap text-sm leading-relaxed text-[var(--lib-ink-muted)]">
                  {project.data[section.key]}
                </p>
              </section>
            ))}
          </div>
        </motion.article>
      )}
    </LibrarySurface>
  );
}
