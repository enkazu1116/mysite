import type { ReactNode } from "react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type { Skill } from "../types/skill";
import { SkillsDataTable } from "./SkillsDataTable";

type Props = {
  table: TanstackTable<Skill>;
  footer?: ReactNode;
};

export function SkillsTableView({ table, footer }: Props) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="lib-panel mt-2 overflow-hidden">
        <SkillsDataTable table={table} />
      </div>
      {footer}
    </section>
  );
}
