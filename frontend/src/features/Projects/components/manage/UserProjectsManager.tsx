import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Link as RouterLink } from "react-router";
import { QueryErrorAlert } from "../../../../components/status";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "../../hooks/useProjectsQuery";
import type { Project } from "../../types/project";
import { ProjectForm } from "./ProjectForm";

export function UserProjectsManager({
  userId,
  canEdit = true,
}: {
  userId?: string;
  canEdit?: boolean;
}) {
  const projects = useProjectsQuery(userId);
  const createProject = useCreateProjectMutation(userId);
  const updateProject = useUpdateProjectMutation();
  const deleteProject = useDeleteProjectMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createFormKey, setCreateFormKey] = useState(0);
  const error =
    projects.error ??
    createProject.error ??
    updateProject.error ??
    deleteProject.error;

  const handleDelete = (project: Project) => {
    const confirmed = window.confirm(
      `「${project.projectName}」を削除しますか？`,
    );
    if (!confirmed) {
      return;
    }
    deleteProject.mutate(project.projectId, {
      onSuccess: () => {
        if (editingId === project.projectId) {
          setEditingId(null);
        }
      },
    });
  };

  return (
    <section className="mx-auto mb-6 max-w-4xl text-left">
      <QueryErrorAlert
        error={error}
        fallback="Projects 管理の処理に失敗しました。"
      />

      {canEdit ? (
        <div className="lib-panel mb-6 p-5">
          <h2 className="font-display m-0 mb-3 text-base font-semibold text-[var(--lib-ink)]">
            プロジェクトを追加
          </h2>
          <ProjectForm
            key={createFormKey}
            submitLabel="登録"
            isPending={createProject.isPending}
            onSubmit={(payload) => {
              createProject.mutate(payload, {
                onSuccess: () => {
                  setCreateFormKey((value) => value + 1);
                },
              });
            }}
          />
        </div>
      ) : (
        <p className="mb-6 text-sm text-[var(--lib-ink-muted)]">
          ゲストユーザーはプロジェクトの登録・編集対象外です。
        </p>
      )}

      <div className="space-y-3">
        {(projects.projects ?? []).map((project) => (
          <article key={project.projectId} className="lib-panel p-5">
            {editingId === project.projectId && canEdit ? (
              <ProjectForm
                initial={project}
                submitLabel="更新"
                isPending={updateProject.isPending}
                onCancel={() => {
                  setEditingId(null);
                }}
                onSubmit={(payload) => {
                  updateProject.mutate(
                    { projectId: project.projectId, payload },
                    {
                      onSuccess: () => {
                        setEditingId(null);
                      },
                    },
                  );
                }}
              />
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display m-0 text-lg font-semibold text-[var(--lib-ink)]">
                      {project.projectName}
                    </h3>
                    <p className="mt-1 mb-0 text-sm text-[var(--lib-ink-muted)]">
                      {project.myRole} · チーム {project.teamSize}名
                    </p>
                    <p className="mt-2 mb-0 text-sm text-[var(--lib-ink-muted)]">
                      {project.overview}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RouterLink
                      to={`/projects/${project.projectId}`}
                      className="lib-link text-sm"
                    >
                      詳細
                    </RouterLink>
                    {canEdit ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => {
                            setEditingId(project.projectId);
                          }}
                        >
                          編集
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          isPending={deleteProject.isPending}
                          onPress={() => {
                            handleDelete(project);
                          }}
                        >
                          削除
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </article>
        ))}

        {!projects.isLoading && (projects.projects?.length ?? 0) === 0 ? (
          <p className="text-sm text-[var(--lib-ink-muted)]">
            登録済みのプロジェクトはありません。
          </p>
        ) : null}
      </div>
    </section>
  );
}
