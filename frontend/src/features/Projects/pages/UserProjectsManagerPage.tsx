import { EmptyState } from "@heroui/react/empty-state";
import { Link as RouterLink, useParams } from "react-router";
import { ArrowLeftIcon } from "../../../components/icons";
import { LibrarySurface } from "../../../components/LibrarySurface.tsx";
import { users } from "../../Users/data/usersData";
import { useProjectsUserIdQuery } from "../hooks/useProjectsQuery";
import { UserProjectsManager } from "../components/manage/UserProjectsManager";

export default function UserProjectsManagerPage() {
  const { userId } = useParams<{ userId: string }>();
  const projectsUserId = useProjectsUserIdQuery();
  const mockUser = users.find((item) => item.id === userId);
  const developer =
    users.find((item) => item.userType === "developer") ?? users[0];
  const isDeveloperMock = mockUser?.userType === "developer";
  const isGuest = mockUser != null && mockUser.userType !== "developer";
  const isResolvedOwner = userId != null && userId === projectsUserId.data;
  const isProjectsOwner = isDeveloperMock || isResolvedOwner;
  const displayUser = isProjectsOwner ? developer : mockUser;
  const resolvedUserId = isGuest
    ? userId
    : isProjectsOwner
      ? projectsUserId.data
      : userId;
  const canEdit = Boolean(displayUser && displayUser.status === "active");

  if (!projectsUserId.isLoading && (!displayUser || !userId)) {
    return (
      <LibrarySurface className="px-6 pb-8 pt-4 sm:px-10">
        <section className="mx-auto max-w-4xl text-left">
          <RouterLink
            to="/users"
            aria-label="Usersへ戻る"
            title="Usersへ戻る"
            className="lib-back"
          >
            <ArrowLeftIcon />
          </RouterLink>
          <EmptyState className="lib-panel mt-5 border-dashed py-10">
            <p className="text-[var(--lib-ink-muted)]">ユーザーが見つかりません。</p>
          </EmptyState>
        </section>
      </LibrarySurface>
    );
  }

  return (
    <LibrarySurface className="px-6 pb-8 pt-4 sm:px-10">
      <section className="mx-auto mb-5 flex max-w-4xl items-center gap-2 text-left">
        <RouterLink
          to="/users"
          aria-label="Usersへ戻る"
          title="Usersへ戻る"
          className="lib-back shrink-0"
        >
          <ArrowLeftIcon />
        </RouterLink>
        <h1 className="font-display m-0 text-xl font-semibold text-[var(--lib-ink)]">
          {displayUser?.name ?? "Projects"} / Projects 管理
        </h1>
      </section>
      <UserProjectsManager userId={resolvedUserId} canEdit={canEdit} />
    </LibrarySurface>
  );
}
