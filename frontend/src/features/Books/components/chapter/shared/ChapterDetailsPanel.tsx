import type { ReactNode } from "react";

export function ChapterDetailsPanel({
  title,
  emptyLabel,
  children,
}: {
  title: string;
  emptyLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="pt-1 text-left" data-chapter-details>
      <h3 className="font-display mb-3 text-base font-semibold text-[var(--lib-ink)]">
        {title}
      </h3>
      {children ?? (
        <p className="m-0 text-xs text-[var(--lib-ink-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}
