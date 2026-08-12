import type { ReactNode } from "react";

export function ChapterCreateCard({ children }: { children: ReactNode }) {
  return (
    <section
      className="border-b border-[var(--lib-line)] pb-4 text-left"
      data-create-form-card
    >
      <h3 className="font-display mb-3 text-base font-semibold text-[var(--lib-ink)]">
        新規追加
      </h3>
      {children}
    </section>
  );
}
