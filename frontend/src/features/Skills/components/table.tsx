import { EmptyState } from "@heroui/react/empty-state";
import { useSkillsTable } from "../hooks/useSkillsTable";
import { useSkillsSuspenseQuery } from "../hooks/useSkillsSuspenseQuery";
import { Pagination } from "./Pagination";
import { SkillsTableView } from "./SkillsTableView";

export default function Table() {
  const query = useSkillsSuspenseQuery();
  const { table } = useSkillsTable(query.skills);

  if (query.skills.length === 0) {
    return (
      <EmptyState className="py-12">
        <p>スキルが見つかりません。</p>
      </EmptyState>
    );
  }

  return <SkillsTableView table={table} footer={<Pagination table={table} />} />;
}
