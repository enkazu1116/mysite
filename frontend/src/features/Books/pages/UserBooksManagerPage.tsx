import { EmptyState, Spinner } from "@heroui/react";
import { Link as RouterLink, useParams } from "react-router";
import { ArrowLeftIcon } from "../../../components/icons";
import { useBooksUserIdQuery } from "../hooks/useBooksQueries";
import { users } from "../../Users/data/usersData";
import { UserBooksManager } from "../components/manage/UserBooksManager";

export default function UserBooksManagerPage() {
  const { userId } = useParams<{ userId: string }>();
  const booksUserId = useBooksUserIdQuery();
  const mockUser = users.find((item) => item.id === userId);
  const developer =
    users.find((item) => item.userType === "developer") ?? users[0];
  const isBooksOwner =
    (userId != null && userId === booksUserId.data) ||
    mockUser?.userType === "developer";
  const displayUser = isBooksOwner ? developer : mockUser;
  const resolvedUserId = isBooksOwner
    ? (booksUserId.data ?? "")
    : (userId ?? "");
  const canEdit = displayUser?.status === "active";
  const isReady = Boolean(displayUser && resolvedUserId);

  if (booksUserId.isLoading) {
    return (
      <main className="surface-library flex-1 px-6 pb-10 pt-6 sm:px-10">
        <section className="mx-auto flex max-w-4xl items-center gap-2 py-10 text-[var(--lib-ink-muted)]">
          <Spinner size="sm" />
          <span className="text-sm">ユーザーを確認中...</span>
        </section>
      </main>
    );
  }

  if (!isReady || !displayUser) {
    return (
      <main className="surface-library flex-1 px-6 pb-8 pt-4 sm:px-10">
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
      </main>
    );
  }

  return (
    <main className="surface-library flex-1 px-6 pb-8 pt-4 sm:px-10">
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
          {displayUser.name} / Books 管理
        </h1>
      </section>
      <UserBooksManager userId={resolvedUserId} canEdit={canEdit} />
    </main>
  );
}
