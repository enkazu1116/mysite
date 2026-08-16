import { Typography } from "@heroui/react/typography";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";
import { ArrowLeftIcon } from "../../../../../components/icons";
import { LibrarySurface } from "../../../../../components/LibrarySurface.tsx";

export function PageShell({
  backTo,
  backLabel,
  title,
  subtitle,
  headerAction,
  children,
}: {
  backTo: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <LibrarySurface className="px-6 pb-10 pt-4 sm:px-10">
      <section
        className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center gap-2 text-left"
        data-page-header
      >
        <RouterLink
          to={backTo}
          aria-label={backLabel}
          title={backLabel}
          className="lib-back shrink-0"
        >
          <ArrowLeftIcon />
        </RouterLink>
        <div className="min-w-0">
          <h1 className="font-display m-0 text-xl font-semibold text-[var(--lib-ink)]">
            {title}
          </h1>
          {subtitle ? (
            <Typography
              type="body-xs"
              className="mt-0.5 line-clamp-1 text-[var(--lib-ink-muted)]"
            >
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {headerAction ? (
          <div className="ml-auto flex shrink-0 items-center" data-header-progress>
            {headerAction}
          </div>
        ) : null}
      </section>
      <section className="mx-auto max-w-3xl" data-page-content>
        {children}
      </section>
    </LibrarySurface>
  );
}
