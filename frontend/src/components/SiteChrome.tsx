import type { ReactNode } from "react";
import "./libraryFonts.css";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="surface-site flex min-h-[100dvh] flex-1 flex-col">
      {children}
    </div>
  );
}
