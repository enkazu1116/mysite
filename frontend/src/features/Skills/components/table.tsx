import { EmptyState } from "@heroui/react";
import { useSkillsTable } from "../hooks/useSkillsTable";
import { useSkillsSuspenseQuery } from "../hooks/useSkillsSuspenseQuery";
import { ErrorState, LoadingState } from "../../../components/status";
import { Pagination } from "./Pagination";
import { SkillsTableView } from "./SkillsTableView";

export default function Table() {
  const query = useSkillsSuspenseQuery();
  const { table } = useSkillsTable(query.skills ?? []);

  if (query.isLoading) {
    return <LoadingState />;
  }

  if (query.error) {
    return (
      <ErrorState
        message={query.error.message}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (query.skills?.length === 0) {
    return (
      <EmptyState className="py-12">
        <p>スキルが見つかりません。</p>
      </EmptyState>
    );
  }

  return <SkillsTableView table={table} footer={<Pagination table={table} />} />;
}
