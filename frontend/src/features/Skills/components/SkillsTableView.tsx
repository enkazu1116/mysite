import type { ReactNode } from "react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { Typography } from "@heroui/react";
import type { Skill } from "../types/skill";
import { SkillsDataTable } from "./SkillsDataTable";

type Props = {
  table: TanstackTable<Skill>;
  footer?: ReactNode;
};

export function SkillsTableView({ table, footer }: Props) {
  return (
    <section className="mx-auto mt-1 w-full max-w-3xl px-2">
      <div className="mb-2 text-left">
        <Typography type="body-xs" color="muted" className="font-medium uppercase tracking-wider">
          Profile
        </Typography>
        <Typography.Heading level={2} className="m-0 mt-1">
          My Skills
        </Typography.Heading>
      </div>
      <div className="mt-2 overflow-hidden rounded-lg">
        <SkillsDataTable table={table} />
      </div>
      {footer}
    </section>
  );
}
