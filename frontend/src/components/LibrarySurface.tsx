import type { ReactNode } from "react";

export function LibrarySurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={`flex-1 ${className}`.trim()}>{children}</main>;
}
