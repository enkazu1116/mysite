import { EmptyState } from "@heroui/react/empty-state";
import { motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "./components/Card";
import { useProjectsQuery } from "./hooks/useProjectsQuery";
import { ErrorState, LoadingState } from "../../components/status";

export default function Projects() {
  const query = useProjectsQuery();
  const projects = query.projects ?? [];
  const reduceMotion = useReducedMotion();
  const errorMessage = query.error?.message;

  return (
    <main className="flex-1 px-4 pb-10 pt-6 sm:px-6">
      <section className="mx-auto max-w-5xl text-left">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="font-display m-0 text-4xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-5xl">
            Projects
          </h1>
          <p className="mt-2 max-w-xl text-base text-[var(--lib-ink-muted)]">
            関わった仕事の記録です。
          </p>
        </motion.div>

        {query.isLoading ? (
          <LoadingState />
        ) : query.error ? (
          <ErrorState
            message={errorMessage ?? "プロジェクトの取得に失敗しました。"}
            onRetry={() => {
              void query.refetch();
            }}
          />
        ) : projects.length === 0 ? (
          <EmptyState className="lib-panel mt-8 border-dashed py-12">
            <p className="text-[var(--lib-ink-muted)]">
              プロジェクトがありません。
            </p>
          </EmptyState>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
