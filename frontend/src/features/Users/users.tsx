import {
  Avatar,
  Chip,
  Input,
  Label,
  TextField,
  Typography,
} from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { Link as RouterLink } from "react-router";
import { useBooksUserIdQuery } from "../Books/hooks/useBooksQueries";
import { users } from "./data/usersData";
import type { UserStatus } from "./types/users";

type ChipColor = "default" | "danger" | "accent" | "success" | "warning";

const statusLabel: Record<UserStatus, string> = {
  active: "Active",
  invited: "Invited",
  inactive: "Inactive",
};

const statusColor: Record<UserStatus, ChipColor> = {
  active: "success",
  invited: "warning",
  inactive: "default",
};

export default function Users() {
  const totalBooks = users.reduce((sum, user) => sum + user.booksCount, 0);
  const reduceMotion = useReducedMotion();
  const booksUserId = useBooksUserIdQuery();
  const booksManagePath = booksUserId.data
    ? `/users/${booksUserId.data}/books`
    : null;

  return (
    <main className="surface-library flex-1 px-4 pb-10 pt-6 sm:px-6">
      <section className="mx-auto mb-8 max-w-3xl text-left">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="font-display m-0 text-4xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-5xl">
            Users
          </h1>
          <p className="mt-2 max-w-xl text-base text-[var(--lib-ink-muted)]">
            表示内容と各ドメインへの編集導線をまとめたディレクトリです。
          </p>
          <p className="mt-3 text-sm text-[var(--lib-ink-muted)]">
            {users.length}人 · 登録本 {totalBooks}冊
          </p>
        </motion.div>

        <div className="mt-5 flex flex-wrap gap-2">
          {booksManagePath ? (
            <RouterLink to={booksManagePath} className="lib-cta">
              Books 管理
            </RouterLink>
          ) : (
            <span className="lib-cta lib-cta-muted">Books 管理</span>
          )}
        </div>
      </section>

      <section className="mx-auto mb-6 max-w-3xl text-left">
        <TextField className="max-w-md">
          <Label className="text-[var(--lib-ink-muted)]">ユーザー検索</Label>
          <Input
            placeholder="名前・メールアドレスで検索"
            className="bg-[var(--lib-paper-elevated)]"
          />
        </TextField>
      </section>

      <section className="mx-auto max-w-3xl text-left" aria-label="ユーザー一覧">
        <ul className="m-0 list-none space-y-3 p-0">
          {users.map((user, index) => (
            <motion.li
              key={user.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: reduceMotion ? 0 : 0.04 * index,
                ease: "easeOut",
              }}
              className="lib-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar className="shrink-0">{user.name.slice(0, 1)}</Avatar>
                <div className="min-w-0">
                  <p className="font-display m-0 truncate text-lg font-semibold text-[var(--lib-ink)]">
                    {user.name}
                  </p>
                  <Typography
                    type="body-xs"
                    className="truncate text-[var(--lib-ink-muted)]"
                  >
                    {user.role} · {user.email}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--lib-ink-muted)] sm:shrink-0">
                <span>
                  <span className="text-[var(--lib-ink)] font-semibold">
                    {user.booksCount}
                  </span>{" "}
                  Books
                </span>
                <span>
                  <span className="text-[var(--lib-ink)] font-semibold">
                    {user.skillsCount}
                  </span>{" "}
                  Skills
                </span>
                <span className="text-xs">{user.lastActiveAt}</span>
                <Chip color={statusColor[user.status]} size="sm" className="w-fit">
                  {statusLabel[user.status]}
                </Chip>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:justify-end">
                {user.userType === "developer" ? (
                  <>
                    {booksManagePath ? (
                      <RouterLink to={booksManagePath} className="lib-link text-sm">
                        Books 管理
                      </RouterLink>
                    ) : (
                      <span className="text-sm text-[var(--lib-ink-muted)]">
                        Books 管理
                      </span>
                    )}
                    <span className="text-sm text-[var(--lib-ink-muted)] opacity-50">
                      Skills 管理
                    </span>
                    <span className="text-sm text-[var(--lib-ink-muted)] opacity-50">
                      Projects 管理
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[var(--lib-ink-muted)]">
                    閲覧のみ
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
}
