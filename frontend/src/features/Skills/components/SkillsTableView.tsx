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
    <section className="mx-auto mt-1 w-full max-w-3xl px-2">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Profile</p>
          <h2 className="m-0 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">My Skills</h2>
        </div>
      </div>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <SkillsDataTable table={table} />
      </div>
      {footer}
    </section>
  );
}
